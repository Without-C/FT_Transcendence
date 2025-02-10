import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'

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
