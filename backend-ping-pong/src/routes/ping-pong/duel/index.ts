import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'

interface Participant {
    id: string;
    ws: any;
}

class MatchManager {
    private queue: Participant[] = [];
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

    tryMatchmaking(): Participant[] | null {
        if (this.queue.length >= this.requiredPlayerCount) {
            const players: Participant[] = [];
            for (let i = 0; i < this.requiredPlayerCount; i++) {
                players.push(this.queue.pop()!);
            }
            players.reverse();
            return players;
        }
        return null;
    }
}

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(websocket)

    const matchManager = new MatchManager(2);
    if (!fastify.hasDecorator('matchManager')) {
        fastify.decorate('matchManager', matchManager);
    }

    fastify.get('/ws', { websocket: true }, async (ws) => {
        const connectionId = uuidv4();
        matchManager.addWaitingParticipant(connectionId, ws);

        try {
            ws.on('message', async (message) => {
                const msg = message.toString()
                await ws.send(msg)
            })

            ws.on('close', async () => {
                matchManager.removeWaitingParticipant(connectionId);
            })
        } catch (error) {
            console.error('WebSocket connection error:', error)
        }
    })
}

export default example;