import { FastifyInstance } from "fastify";
import { IMessageBroker } from "../utils/IMessageBrocker";

export class AmqpMessageBrocker implements IMessageBroker {
    constructor(private fastify: FastifyInstance) { }

    sendGameResult(message: any): void {
        this.fastify.amqpChannel.sendToQueue('duel-result',
            Buffer.from(JSON.stringify(message)));
    }
}