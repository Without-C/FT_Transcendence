import { Player } from "../utils/Player";
import { FastifyInstance } from "fastify";
import { AmqpMessageBrocker } from "./AmqpMessageBrocker";
import { GameManager } from "./GameManager";

export class MatchManager {
    private waitingPlayers: Player[] = [];
    private games: Map<string, GameManager> = new Map();
    private requiredPlayers: number;

    constructor(private fastify: FastifyInstance, requirePlayers: number) {
        this.requiredPlayers = requirePlayers;
    }

    public addPlayer(player: Player) {
        this.waitingPlayers.push(player);
    }

    public tryMatchmaking(): void {
        if (this.waitingPlayers.length >= this.requiredPlayers) {
            const playerForMatch = this.waitingPlayers.splice(0, this.requiredPlayers);
            const messageBroker = new AmqpMessageBrocker(this.fastify);
            const game = new GameManager(playerForMatch, messageBroker);
            playerForMatch.forEach(player => {
                player.game = game;
            });
            this.games.set(game.id, game);
        }
    }

    public removePlayer(player: Player): void {
        this.waitingPlayers = this.waitingPlayers.filter(p => p.id !== player.id);

        for (const [roomId, room] of this.games.entries()) {
            if (room.hasPlayer(player)) {
                room.onPlayerDisconnect(player);
                this.games.delete(roomId);
                break;
            }
        }
    }
}
