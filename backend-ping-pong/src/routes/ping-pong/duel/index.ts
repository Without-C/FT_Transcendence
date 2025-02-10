import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'

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

    fastify.get('/ws', { websocket: true }, async (ws) => {
        const player = new Player(ws);

        ws.on('message', async (message) => {
            const data = JSON.parse(message.toString())
            player.send(data)
            player.send(player.id)
        })

        ws.on('close', async () => {
        })
    })
}

export default example;