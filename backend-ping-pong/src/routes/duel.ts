import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'

import { MatchManager } from "../common/MatchManager"
import { Player } from "../common/Player"

import { MessageBrocker } from "../duel/MessageBroker"
import { GameManagerFactory } from "../duel/GameManagerFactory"

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(websocket)

    const messageBroker = new MessageBrocker(fastify);
    const gameManagerFactory = new GameManagerFactory(messageBroker);
    const matchManager = new MatchManager(2, gameManagerFactory);

    fastify.get('/ping-pong/duel/ws', { websocket: true }, async (ws) => {
        const player = new Player("player-" + uuidv4(), uuidv4().substring(0, 2), ws);
        matchManager.addPlayer(player);
        matchManager.tryMatchmaking();

        ws.on('message', async (message) => {
            const data = JSON.parse(message.toString())
            if (player.game) {
                player.game.onMessage(player, data);
            }
        });

        ws.on('close', async () => {
            matchManager.removePlayer(player);
        });
    })
}

export default example;