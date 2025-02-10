import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(websocket)

    fastify.get('/ws', { websocket: true }, async (ws) => {
        ws.on('message', async (message) => {
            const msg = message.toString()
            await ws.send(msg)
        })

        ws.on('close', async () => {
        })
    })
}

export default example;