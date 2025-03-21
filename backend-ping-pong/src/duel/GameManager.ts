import { v4 as uuidv4 } from 'uuid'

import { Player } from "../common/Player";
import { IMessageBroker } from "../common/IMessageBrocker";
import { IGameManager } from "../common/IGameManager";
import { DuelManager } from '../common/DuelManager';

export class GameManager implements IGameManager {
    public id: string;
    private isPlaying: boolean = false;
    private duelManager: DuelManager;

    constructor(private players: Player[], private messageBroker: IMessageBroker) {
        this.id = 'duel-' + uuidv4();
        this.isPlaying = true;
        this.onEndDuel = this.onEndDuel.bind(this);
        this.duelManager = new DuelManager(players, players, 0, this.onEndDuel);
        this.duelManager.startGame();
    }

    private onEndDuel(winner: Player, roundScores: number[], reason: string): void {
        this.isPlaying = false;

        this.messageBroker.sendGameResult([{
            game_end_reason: reason,
            player1: {
                id: this.players[0].id,
                round_score: roundScores[0],
                result: winner.username === this.players[0].username ? "winner" : "loser",
            },
            player2: {
                id: this.players[1].id,
                round_score: roundScores[1],
                result: winner.username === this.players[1].username ? "winner" : "loser",
            },
        }]);
    }

    public onMessage(from: Player, message: any): void {
        if (message.action === "key") {
            const { key, state } = message;
            const player = this.players.find(p => p.id === from.id);
            if (player) {
                player.keyState.set(key, state);
            }
        }
    }

    public onPlayerDisconnect(disconnectedPlayer: Player): boolean {
        if (!this.players.some(p => p.id === disconnectedPlayer.id)) {
            return false;
        }

        if (!this.isPlaying) {
            return true;
        }
        this.isPlaying = false;
        const roundScores = this.duelManager.haltGame();

        this.players.forEach(p => {
            if (p.id !== disconnectedPlayer.id) {
                p.send({
                    type: "opponent_exit",
                    opponent_username: disconnectedPlayer.username
                });
            }
        });

        const remainingPlayer = this.players.find(p => p.id !== disconnectedPlayer.id);

        this.messageBroker.sendGameResult([{
            game_end_reason: "player_disconnected",
            player1: {
                id: this.players[0].id,
                round_score: roundScores[0],
                result: (remainingPlayer && this.players[0].id === remainingPlayer.id) ? "winner" : "loser",
            },
            player2: {
                id: this.players[1].id,
                round_score: roundScores[1],
                result: (remainingPlayer && this.players[1].id === remainingPlayer.id) ? "winner" : "loser",
            },
        }]);

        return true;
    }

    public getAlivePlayerNumber(): number {
        return this.players.filter(player => player.getIsAlive()).length;
    }
}
