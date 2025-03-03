import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'
import { MatchManager } from "../duel/MatchManager"
import { Player } from "../utils/Player"

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(websocket)

    const matchManager = new MatchManager(fastify, 2);

    fastify.get('/ping-pong/duel/ws', { websocket: true }, async (ws) => {
        const player = new Player("player-" + uuidv4(), uuidv4().substring(0, 2), ws);
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