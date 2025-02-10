import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'

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
            tick: 0,
        };
    }

    private run(): void {
        this.broadcast({ type: "start", });

        setInterval(() => {
            this.update();
            this.broadcast({ type: "wait", });
        }, 1000 / 60);
    }

    private update(): void {
        this.state.tick += 1;
    }

    public onMessage(from: Player, message: any): void {
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
    private rooms: Map<string, PingPong> = new Map();
    private requiredPlayers: number;

    constructor(requirePlayers: number) {
        this.requiredPlayers = requirePlayers;
    }

    public addPlayer(player: Player) {
        this.waitingPlayers.push(player);
    }

    public tryMatchmaking(): PingPong | null {
        if (this.waitingPlayers.length >= this.requiredPlayers) {
            const playerForMatch = this.waitingPlayers.splice(0, this.requiredPlayers);
            const room = new PingPong(playerForMatch);
            this.rooms.set(room.id, room);
            return room;
        }
        return null;
    }

    public removePlayer(player: Player): void {
        this.waitingPlayers = this.waitingPlayers.filter(p => p.id !== player.id);

        for (const [roomId, room] of this.rooms.entries()) {
            if (room.hasPlayer(player)) {
                room.onPlayerDisconnect(player);
                this.rooms.delete(roomId);
                break;
            }
        }
    }

}

class Player {
    public id: string;
    public ws: any;

    constructor(ws: any) {
        this.id = 'player-' + uuidv4();
        this.ws = ws;
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
        const game = matchManager.tryMatchmaking();

        ws.on('message', async (message) => {
            const data = JSON.parse(message.toString())
            if (game) {
                game.onMessage(player, data);
            }
        });

        ws.on('close', async () => {
            matchManager.removePlayer(player);
        });
    })
}

export default example;