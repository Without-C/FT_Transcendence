import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'

interface Player {
    id: string;
    ws: any;

    group_name?: string;
}

class MatchManager {
    private queue: Player[] = [];
    private requiredPlayerCount: number;

    constructor(requiredPlayerCount: number) {
        this.requiredPlayerCount = requiredPlayerCount;
    }

    addWaitingParticipant(player: Player): void {
        this.queue.push(player);
    }

    removeWaitingParticipant(id: string): void {
        const index = this.queue.findIndex(player => player.id === id);
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
    }

    getWaitingCount(): number {
        return this.queue.length;
    }

    tryMatchmaking(): Player[] | null {
        if (this.queue.length >= this.requiredPlayerCount) {
            const players: Player[] = [];
            for (let i = 0; i < this.requiredPlayerCount; i++) {
                players.push(this.queue.pop()!);
            }
            players.reverse();
            return players;
        }
        return null;
    }
}

class Group {
    private participants: Map<string, any> = new Map();

    constructor(group_name: string, participants: Player[]) {
        participants.forEach(player => {
            player.group_name = group_name;
            this.participants.set(player.id, player.ws);
        });
    }

    broadcast(message: string): void {
        this.participants.forEach((ws) => {
            ws.send(message);
        });
    }
}


const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(websocket)

    const matchManager = new MatchManager(2);
    let groups = new Map();

    const makeRoom = (participants: Player[]): void => {
        let group_name = uuidv4();
        const group = new Group(group_name, participants);
        groups.set(group_name, group);

        group.broadcast(JSON.stringify({ message: "hi" }));
    };

    fastify.get('/ws', { websocket: true }, async (ws) => {
        let player: Player = { id: uuidv4(), ws }
        matchManager.addWaitingParticipant(player);

        const match_result = matchManager.tryMatchmaking();
        if (match_result) {
            makeRoom(match_result);
        }

        ws.on('message', async (message) => {
            const msg = message.toString()
            await ws.send(msg)
            await ws.send(JSON.stringify({ group_name: player.group_name ? player.group_name : null }));
        })

        ws.on('close', async () => {
            matchManager.removeWaitingParticipant(player.id);
        })
    })
}

export default example;