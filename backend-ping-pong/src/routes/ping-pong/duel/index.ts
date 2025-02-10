import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'

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
    private state: any;
    private intervalId: NodeJS.Timeout | null = null;

    constructor(players: Player[]) {
        this.id = 'pingpong-' + uuidv4();
        this.players = players;
        this.state = this.initializeGame();
        this.run();
    }

    private initializeGame(): any {
        return {
            ball: {
                x: 200,
                y: 300
            },
            paddle1: {
                x: 30,
                y: 200,
                width: 10,
                height: 100,
            },
            paddle2: {
                x: 570,
                y: 200,
                width: 10,
                height: 100,
            },
        };
    }

    private run(): void {
        this.broadcast({ type: "start", });

        setInterval(() => {
            this.update();
            this.broadcast({
                type: "game_state",
                game_state: this.state,
            });

            this.state.tick += 1;
        }, 1000 / 60);
    }

    private update(): void {
        if (this.players[0].keyState.get("w")) {
            this.state.paddle1.y -= 5;
        }
        if (this.players[0].keyState.get("s")) {
            this.state.paddle1.y += 5;
        }

        if (this.players[1].keyState.get("w")) {
            this.state.paddle2.y -= 5;
        }
        if (this.players[1].keyState.get("s")) {
            this.state.paddle2.y += 5;
        }
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
        this.players.forEach(p => {
            if (p.id !== player.id) {
                p.send({
                    type: "opponent_exit",
                });
            }
        });

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
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