import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'

class PingPong {
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
                room.handlePlayerDisconnect(player);
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

const matchManager = new MatchManager(2);

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(websocket)

    fastify.get('/ws', { websocket: true }, async (ws) => {
        const player = new Player(ws);

        const game = matchManager.addPlayer(player);

        ws.on('message', async (message) => {
            const data = JSON.parse(message.toString())
            game.handleMessage(player, data);
        })

        ws.on('close', async () => {
            game.removePlayer(player);
        })
    })
}

export default example;