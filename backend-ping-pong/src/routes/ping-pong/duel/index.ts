import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'

class MatchManager {
    private queue: string[] = [];
    private requiredPlayerCount: number;

    constructor(requiredPlayerCount: number) {
        this.requiredPlayerCount = requiredPlayerCount;
    }

    addWaitingParticipant(identifier: string): void {
        this.queue.push(identifier);
    }

    removeWaitingParticipant(identifier: string): void {
        const index = this.queue.indexOf(identifier);
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
    }

    tryMatchmaking(): string[] | null {
        if (this.queue.length >= this.requiredPlayerCount) {
            const players: string[] = [];
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

    fastify.get('/ws', { websocket: true }, async (connection) => {
        try {
            connection.on('message', async (message) => {
                const msg = message.toString()
                console.log('Received message:', msg)
                await connection.send(msg)
            })

            connection.on('close', async () => {
                console.log('Client disconnected')
            })
        } catch (error) {
            console.error('WebSocket connection error:', error)
        }
    })
}

export default example;