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
        // 메시지 큐 연결
        const amqpUrl = fastify.config.AMQP_URL;
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        var queue = 'hello';
        await channel.assertQueue(queue, { durable: false });

        // fastify의 다른 곳에서 메시지 큐를 사용할 수 있도록 channel을 등록
        fastify.decorate('amqpChannel', channel);

        // fastify가 종료될 때 메시지 큐 연결도 끊도록 훅 등록
        fastify.addHook('onClose', async () => {
            await channel.close();
            await connection.close();
        })
    }
}, { dependencies: ['env'] });

export default amqpPlugin;
