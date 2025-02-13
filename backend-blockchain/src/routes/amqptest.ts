import { FastifyPluginAsync } from 'fastify'

const amqptest: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/send', async function (request, reply) {
        fastify.amqpChannel.sendToQueue('hello', Buffer.from('welcome'));
        return { root: true }
    })

    fastify.get('/receive', async function (request, reply) {
        const msg = await fastify.amqpChannel.get('hello', { noAck: true });
        return { root: msg }
    })
}

export default amqptest;
