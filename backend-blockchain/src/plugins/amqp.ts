import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin'
import amqp from 'amqplib';

declare module 'fastify' {
    interface FastifyInstance {
        amqpChannel: amqp.Channel;
    }
}

const amqpPlugin: FastifyPluginAsync = fp(async (fastify) => {
    if (!fastify.hasDecorator('amqpChannel')) {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        var queue = 'hello';
        await channel.assertQueue(queue, { durable: false });

        fastify.decorate('amqpChannel', channel);

        fastify.addHook('onClose', async () => {
            await channel.close();
            await connection.close();
        })
    }
});

export default amqpPlugin;
