import { FastifyInstance } from "fastify";
import { IMessageBroker } from "../common/IMessageBrocker";

export class MessageBrocker implements IMessageBroker {
    constructor(private fastify: FastifyInstance) { }

    sendGameResult(message: any): void {
        this.fastify.amqpChannel.sendToQueue('duel-result',
            Buffer.from(JSON.stringify(message)));
    }
}