import { Ball } from "./Ball";
import { Rectangle } from "./Rectangle";
import { Player } from "./Player";
import { KeyState } from "./KeyState";
import { v4 as uuidv4 } from 'uuid'

export class PingPong {
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
