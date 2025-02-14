import { Player } from "./Player";
import { PingPong } from "./PingPong";
import { FastifyInstance } from "fastify";

export class MatchManager {
    private fastify: FastifyInstance
    private waitingPlayers: Player[] = [];
    private games: Map<string, PingPong> = new Map();
    private requiredPlayers: number;

    constructor(fastify: FastifyInstance, requirePlayers: number) {
        this.fastify = fastify;
        this.requiredPlayers = requirePlayers;
    }

    public addPlayer(player: Player) {
        this.waitingPlayers.push(player);
    }

    public tryMatchmaking(): void {
        if (this.waitingPlayers.length >= this.requiredPlayers) {
            const playerForMatch = this.waitingPlayers.splice(0, this.requiredPlayers);
            const game = new PingPong(this.fastify, playerForMatch);
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
