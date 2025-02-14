import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin'
import amqp from 'amqplib';

declare module 'fastify' {
    interface FastifyInstance {
        amqpChannel: amqp.Channel;
    }
}

// 메시지(게임 결과)를 받을 때마다 호출되는 함수
function handleMessage(fastify: FastifyInstance, channel: amqp.Channel, msg: amqp.ConsumeMessage) {
    // 메시지 처리
    fastify.log.info("%s", msg.content.toString());

    // 게임 결과를 블록체인에 무사히 올렸으면 메시지 큐에게 ack 전송
    channel.ack(msg);
}

const amqpPlugin: FastifyPluginAsync = fp(async (fastify) => {
    if (!fastify.hasDecorator('amqpChannel')) {
        // 메시지 큐 연결
        const amqpUrl = fastify.config.AMQP_URL;
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue('duel-result', { durable: false });

        // 메시지(게임 결과)를 받았을 때 처리할 함수 등록
        channel.consume('duel-result', function (msg) {
            // consumer 연결이 끊긴 경우 msg가 null이 들어올 수 있어 예외처리
            if (!msg) {
                fastify.log.warn("Consumer cancelled");
                return;
            }
            handleMessage(fastify, channel, msg);
        });

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
