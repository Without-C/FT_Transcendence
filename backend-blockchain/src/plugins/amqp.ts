import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin'
import amqp from 'amqplib';

declare module 'fastify' {
    interface FastifyInstance {
        amqpChannel: amqp.Channel;
    }
}

// const example_msg1 = {
//     "game_end_reason": "normal",    // 게임이 정상적으로 종료되었음
//     "player1": {
//         "id": "player-577a2d57-005f-42d7-a855-5d352d193cff",
//         "round_score": 2,
//         "result": "winner",
//     }, "player2": {
//         "id": "player-a81108f7-8ff7-4654-bc52-dbcd4dfff245",
//         "round_score": 1,
//         "result": "loser",
//     },
// };

// const example_msg2 = {
//     "game_end_reason": "player_disconnected",   // 상대방이 중간에 나가 게임이 종료되었음
//     "player1": {
//         "id": "player-95883643-eaa0-4a0d-a330-ad88343b8d39",
//         "round_score": 0,
//         "result": "loser",
//     },
//     "player2": {
//         "id": "player-fccde446-6fb7-4575-924e-9772ddd900f2",
//         "round_score": 1,
//         "result": "winner",
//     },
// };

// 메시지(duel 게임 결과)를 받을 때마다 호출되는 함수
function handleDuelMessage(fastify: FastifyInstance, channel: amqp.Channel, msg: amqp.ConsumeMessage) {
    // 메시지 처리
    fastify.log.info("%s", msg.content.toString());
    // fastify.log.info("%s", msg.content.toJSON());

    // 게임 결과를 블록체인에 무사히 올렸으면 메시지 큐에게 ack 전송
    channel.ack(msg);
}

// [
//     {
//       "game_end_reason": "normal",
//       "player1": {
//         "id": "player-52db1b24-f6cb-4af8-a431-a27b8d036368",
//         "round_score": 3,
//         "result": "winner"
//       },
//       "player2": {
//         "id": "player-899f9407-1aff-427f-9f69-f5406dd5cbc4",
//         "round_score": 0,
//         "result": "loser"
//       }
//     },
//     {
//        생략
//     },
//     {
//        생략
//     }
//   ]

// 메시지(tournament 게임 결과)를 받을 때마다 호출되는 함수
function handleTournamentMessage(fastify: FastifyInstance, channel: amqp.Channel, msg: amqp.ConsumeMessage) {
    // 메시지 처리
    fastify.log.info("%s", msg.content.toString());
    // fastify.log.info("%s", msg.content.toJSON());

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

        // 메시지(duel 게임 결과)를 받았을 때 처리할 함수 등록
        channel.consume('duel-result', function (msg) {
            // consumer 연결이 끊긴 경우 msg가 null이 들어올 수 있어 예외처리
            if (!msg) {
                fastify.log.warn("Consumer cancelled");
                return;
            }
            handleDuelMessage(fastify, channel, msg);
        });

        // 메시지(tournament 게임 결과)를 받았을 때 처리할 함수 등록
        channel.consume('tournament-result', function (msg) {
            // consumer 연결이 끊긴 경우 msg가 null이 들어올 수 있어 예외처리
            if (!msg) {
                fastify.log.warn("Consumer cancelled");
                return;
            }
            handleTournamentMessage(fastify, channel, msg);
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
