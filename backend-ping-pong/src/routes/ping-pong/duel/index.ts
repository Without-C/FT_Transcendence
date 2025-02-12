import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'

import { MatchManager } from "../../../duel/MatchManager"
import { Player } from "../../../duel/Player"

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(websocket)

    const matchManager = new MatchManager(2);

    fastify.get('/ws', { websocket: true }, async (ws) => {
        const player = new Player(ws);
        player.send({ type: "wait" })

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