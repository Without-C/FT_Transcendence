import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'

class Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;

    constructor(x: number, y: number, vx: number, vy: number, radius: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
    }

    update(): void {
        this.x += this.vx;
        this.y += this.vy;
    }

    collideWithRect(rect: Rectangle): boolean {
        const left = rect.x - rect.width / 2;
        const top = rect.y - rect.height / 2;
        const right = rect.x + rect.width / 2;
        const bottom = rect.y + rect.height / 2;

        const closestX = Math.max(left, Math.min(this.x, right));
        const closestY = Math.max(top, Math.min(this.y, bottom));

        const dx = this.x - closestX;
        const dy = this.y - closestY;

        if (dx * dx + dy * dy < this.radius * this.radius) {
            if (Math.abs(dx) > Math.abs(dy)) {
                this.vx = -this.vx;
            } else {
                this.vy = -this.vy;
            }
            return true;
        }
        return false;
    }
}

class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class KeyState {
    private keyState: Record<string, boolean>;

    constructor() {
        this.keyState = {};
    }

    public set(key: string, state: 'press' | 'release'): void {
        if (state === 'press') {
            this.keyState[key] = true;
        } else if (state === 'release') {
            this.keyState[key] = false;
        }
    }

    public get(key: string): boolean {
        return this.keyState[key] ?? false;
    }
}

class PingPong {
    public id: string;
    private players: Player[];
    private intervalId: NodeJS.Timeout | null = null;

    // 화면 크기
    private readonly width = 600;
    private readonly height = 400;

    // 시간
    private tick = 0;

    // 패들
    private paddle_speed = 5
    private paddle_width = 10
    private paddle_height = 100
    private paddle_margin = 30

    // 벽
    private wall_depth = 10;

    // 공 초기화
    private ball = new Ball(this.width / 2, this.height / 2, 5, 5, 10);

    // 벽 초기화
    private wall_top = new Rectangle(
        this.width / 2, -this.wall_depth / 2, this.width, this.wall_depth
    );
    private wall_bottom = new Rectangle(
        this.width / 2,
        this.height + this.wall_depth / 2,
        this.width,
        this.wall_depth,
    );
    private wall_left = new Rectangle(
        -this.wall_depth / 2, this.height / 2, this.wall_depth, this.height
    );
    private wall_right = new Rectangle(
        this.width + this.wall_depth / 2,
        this.height / 2,
        this.wall_depth,
        this.height,
    );

    // 패들 초기화
    private paddle1 = new Rectangle(
        this.paddle_margin, this.height / 2, this.paddle_width, this.paddle_height
    );
    private paddle2 = new Rectangle(
        this.width - this.paddle_margin,
        this.height / 2,
        this.paddle_width,
        this.paddle_height,
    );

    constructor(players: Player[]) {
        this.id = 'pingpong-' + uuidv4();
        this.players = players;
        this.run();
    }

    private run(): void {
        this.broadcast({ type: "start", });

        this.intervalId = setInterval(() => {
            this.update();
            this.broadcast({
                type: "game_state",
                game_state: {
                    ball: {
                        x: this.ball.x,
                        y: this.ball.y,
                    },
                    paddle1: {
                        x: this.paddle1.x,
                        y: this.paddle1.y,
                        width: this.paddle1.width,
                        height: this.paddle1.height,
                    },
                    paddle2: {
                        x: this.paddle2.x,
                        y: this.paddle2.y,
                        width: this.paddle2.width,
                        height: this.paddle2.height,
                    }
                }
            });

            this.tick += 1;
        }, 1000 / 60);
    }

    private update(): void {
        const paddleKeyPairs: [KeyState, Rectangle][] = [
            [this.players[0].keyState, this.paddle1],
            [this.players[1].keyState, this.paddle2],
        ];

        paddleKeyPairs.forEach(([KeyState, paddle]) => {
            if (KeyState.get("ArrowUp") || KeyState.get("w")) {
                paddle.y -= this.paddle_speed;
            }
            if (KeyState.get("ArrowDown") || KeyState.get("s")) {
                paddle.y += this.paddle_speed;
            }

            const halfHeight = paddle.height / 2;
            paddle.y = Math.max(halfHeight, Math.min(paddle.y, this.height - halfHeight));
        })

        const rects: Rectangle[] = [
            this.wall_top,
            this.wall_bottom,
            this.wall_left,
            this.wall_right,
            this.paddle1,
            this.paddle2,
        ];
        rects.forEach(rect => {
            this.ball.collideWithRect(rect);
        });

        this.ball.update();
    }

    public onMessage(from: Player, message: any): void {
        const action = message.action

        if (action === "key") {
            const key = message.key;
            const state = message.state

            for (const player of this.players) {
                if (player.id === from.id) {
                    player.keyState.set(key, state);
                    break;
                }
            }
        }
    }

    public hasPlayer(player: Player): boolean {
        return this.players.some(p => p.id === player.id);
    }

    public onPlayerDisconnect(player: Player): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.players.forEach(p => {
            if (p.id !== player.id) {
                p.send({
                    type: "opponent_exit",
                });
            }
        });
    }

    private broadcast(message: any): void {
        this.players.forEach(p => {
            p.send(message);
        });
    }
}

class MatchManager {
    private waitingPlayers: Player[] = [];
    private games: Map<string, PingPong> = new Map();
    private requiredPlayers: number;

    constructor(requirePlayers: number) {
        this.requiredPlayers = requirePlayers;
    }

    public addPlayer(player: Player) {
        this.waitingPlayers.push(player);
    }

    public tryMatchmaking(): void {
        if (this.waitingPlayers.length >= this.requiredPlayers) {
            const playerForMatch = this.waitingPlayers.splice(0, this.requiredPlayers);
            const game = new PingPong(playerForMatch);
            playerForMatch.forEach(player => {
                player.game = game;
            });
            this.games.set(game.id, game);
        }
    }

    public removePlayer(player: Player): void {
        this.waitingPlayers = this.waitingPlayers.filter(p => p.id !== player.id);

        for (const [roomId, room] of this.games.entries()) {
            if (room.hasPlayer(player)) {
                room.onPlayerDisconnect(player);
                this.games.delete(roomId);
                break;
            }
        }
    }

}

class Player {
    public id: string;
    public ws: any;
    public keyState: KeyState;
    public game: PingPong | null = null;

    constructor(ws: any) {
        this.id = 'player-' + uuidv4();
        this.ws = ws;
        this.keyState = new KeyState();
    }

    public send(message: any): void {
        this.ws.send(JSON.stringify(message))
    }
}

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(websocket)

    const matchManager = new MatchManager(2);

    fastify.get('/ws', { websocket: true }, async (ws) => {
        const player = new Player(ws);
        player.send({ type: "wait" })

        matchManager.addPlayer(player);
        matchManager.tryMatchmaking();

        ws.on('message', async (message) => {
            const data = JSON.parse(message.toString())
            if (player.game) {
                player.game.onMessage(player, data);
            }
        });

        ws.on('close', async () => {
            matchManager.removePlayer(player);
        });
    })
}

export default example;