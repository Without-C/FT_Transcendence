import { v4 as uuidv4 } from 'uuid'

import { Player } from "../common/Player";
import { IMessageBroker } from "../common/IMessageBrocker";
import { IGameManager } from "../common/IGameManager";
import { DuelManager } from '../common/DuelManager';
import { GameResult } from '../common/GameResult';

export class GameManager implements IGameManager {
    public id: string;
    private isPlaying: boolean = false;
    private duelManager: DuelManager | null = null;
    private matches: Player[][] = [];
    private gameResults: GameResult[] = [];
    private currentRound: number = 0;
    private currentPlayers: Player[] = [];

    constructor(private players: Player[], private messageBroker: IMessageBroker) {

        function shufflePlayers(players: Player[]): Player[] {
            const shuffled = [...players];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        function initMatches(players: Player[]): Player[][] {
            const matches: Player[][] = [];
            for (let i = 0; i < players.length; i += 2) {
                matches.push([players[i], players[i + 1]]);
            }
            return matches;
        }

        this.id = 'duel-' + uuidv4();
        this.isPlaying = true;
        this.onEndRound = this.onEndRound.bind(this);

        this.players = shufflePlayers(this.players);
        this.matches = initMatches(this.players);

        this.startTournament();
    }

    private startTournament() {
        this.broadcast({ type: "tournament_start" });
        this.startRound();
    }

    private startRound() {
        const player1: Player = this.matches[this.currentRound][0];
        const player2: Player = this.matches[this.currentRound][1];

        this.currentPlayers.length = 0;
        this.currentPlayers.push(player1);
        this.currentPlayers.push(player2);

        this.duelManager = new DuelManager([player1, player2], this.players, this.currentRound, this.onEndRound);
        this.duelManager.startGame();
    }

    private onEndRound(winner: Player, roundScores: number[]): void {
        this.gameResults.push({
            game_end_reason: "normal",
            player1: {
                id: this.currentPlayers[0].id,
                round_score: roundScores[0],
                result: winner.username === this.currentPlayers[0].username ? "winner" : "loser",
            },
            player2: {
                id: this.currentPlayers[1].id,
                round_score: roundScores[1],
                result: winner.username === this.currentPlayers[1].username ? "winner" : "loser",
            },
        });

        this.currentRound += 1;
        switch (this.currentRound) {
            case 1:
                this.matches.push([winner!]);
                this.startRound();
                break;
            case 2:
                this.matches[2].push(winner!);
                this.startRound();
                break;
            case 3:
                this.endTournament();
                break;
        }
    }

    private endTournament() {
        this.isPlaying = false;
        this.broadcast({ type: "tournament_end" });
        this.messageBroker.sendGameResult(this.gameResults);
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

        // FIXME: 나가는 처리 어떻게 할 지는 더 고민해야함.
        if (this.duelManager === null) {
            return true;
        }
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

    private broadcast(message: any): void {
        this.players.forEach(p => {
            p.send(message);
        });
    }
}
