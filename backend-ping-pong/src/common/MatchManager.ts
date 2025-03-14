import { Player } from "./Player";
import { IGameManager } from "./IGameManager";
import { IGameManagerFactory } from "./IGameManagerFactory";

export class MatchManager {
    private waitingPlayers: Player[] = [];
    private games: Map<string, IGameManager> = new Map();

    constructor(
        private requiredPlayers: number,
        private gameManagerFactory: IGameManagerFactory,
    ) { }

    public addPlayer(player: Player) {
        player.send({ type: "wait" })
        this.waitingPlayers.push(player);
    }

    public tryMatchmaking(): void {
        if (this.waitingPlayers.length >= this.requiredPlayers) {
            const playerForMatch = this.waitingPlayers.splice(0, this.requiredPlayers);
            const game = this.gameManagerFactory.createGameManager(playerForMatch);
            playerForMatch.forEach(player => {
                player.game = game;
            });
            this.games.set(game.id, game);
        }
    }

    public removePlayer(player: Player): void {
        this.waitingPlayers = this.waitingPlayers.filter(p => p.id !== player.id);

        for (const [gameId, game] of this.games.entries()) {
            if (game.onPlayerDisconnect(player)) {
                if (game.getAlivePlayerNumber() == 0) {
                    this.games.delete(gameId);
                }
                break;
            }
        }
    }
}
