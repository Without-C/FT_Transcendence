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

    fastify.get('/ws', { websocket: true }, (connection) => {
        connection.on('message', message => {
            const msg = message.toString()
            console.log('Received message:', msg)
            connection.send(msg)
        })

        connection.on('close', () => {
            console.log('Client disconnected')
        })
    })
}

export default example;