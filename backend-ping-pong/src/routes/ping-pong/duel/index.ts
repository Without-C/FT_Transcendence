import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'

interface Player {
    id: string;
    ws: any;
}

class MatchManager {
    private queue: Player[] = [];
    private requiredPlayerCount: number;

    constructor(requiredPlayerCount: number) {
        this.requiredPlayerCount = requiredPlayerCount;
    }

    addWaitingParticipant(id: string, ws: any): void {
        this.queue.push({ id, ws });
    }

    removeWaitingParticipant(id: string): void {
        const index = this.queue.findIndex(participant => participant.id === id);
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

    constructor(participants: Player[]) {
        participants.forEach(participant => {
            this.participants.set(participant.id, participant.ws);
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
        const group = new Group(participants);
        groups.set(group_name, group);

        group.broadcast(JSON.stringify({ message: "hi" }));
    };

    fastify.get('/ws', { websocket: true }, async (ws) => {
        const identifier = uuidv4();
        let group_name: string | null = null;
        matchManager.addWaitingParticipant(identifier, ws);

        const match_result = matchManager.tryMatchmaking();
        if (match_result) {
            makeRoom(match_result);
        }

        ws.on('message', async (message) => {
            const msg = message.toString()
            await ws.send(msg)
        })

        ws.on('close', async () => {
            matchManager.removeWaitingParticipant(identifier);
        })
    })
}

export default example;