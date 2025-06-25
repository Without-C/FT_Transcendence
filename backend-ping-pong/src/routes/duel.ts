import { FastifyPluginAsync } from "fastify"
import websocket from '@fastify/websocket'
import { v4 as uuidv4 } from 'uuid'
import { MatchManager } from "../common/MatchManager"
import { Player } from "../common/Player"
import { MessageBrocker } from "../duel/MessageBroker"
import { GameManagerFactory } from "../duel/GameManagerFactory"
import { nicknameRegistry } from "../plugins/nickname-registry"

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    await fastify.register(websocket)

    const messageBroker = new MessageBrocker(fastify);
    const gameManagerFactory = new GameManagerFactory(messageBroker);
    const matchManager = new MatchManager(2, gameManagerFactory);

    fastify.get('/ping-pong/duel/ws', { websocket: true }, async (ws) => {
        let player: Player | null = null;

        ws.on('message', async (message) => {
            const data = JSON.parse(message.toString())

            // Handle set nickname
            if (data.type === 'set_nickname') {
                // Check if the nickname is already exists
                if (nicknameRegistry.has(data.nickname)) {
                    ws.send(JSON.stringify({ type: 'error', message: 'You are already playing a game' }));
                    ws.close();
                    return;
                }
                if (!fastify.config.ALLOW_CONCURRENT_GAMES) {
                    nicknameRegistry.add(data.nickname);
                }

                // Create a new player
                player = new Player("player-" + uuidv4(), data.nickname, ws);

                // Add player to the match manager
                matchManager.addPlayer(player);
                matchManager.tryMatchmaking();

                return;
            }

            if (player && player.game) {
                player.game.onMessage(player, data);
            }
        });

        ws.on('close', async () => {
            if (!player) return;

            player.die();
            matchManager.removePlayer(player);
            if (player.username && nicknameRegistry.has(player.username)) {
                nicknameRegistry.delete(player.username);
            }
        });
    })
}

export default example;