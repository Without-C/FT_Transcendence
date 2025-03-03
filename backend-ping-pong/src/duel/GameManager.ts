import { v4 as uuidv4 } from 'uuid'

import { GameEngine } from "./GameEngine";

import { Player } from "../common/Player";
import { IMessageBroker } from "../common/IMessageBrocker";
import { IGameManager } from "../common/IGameManager";

export class GameManager implements IGameManager {
    public id: string;
    private isPlaying: boolean = false;
    private players: Player[];
    private engine: GameEngine | null = null;
    private countdownInterval: any = null;

    // 목표 점수
    private readonly targetScore = 3;

    // 라운드
    private currentRound: number = 1;
    private readonly totalRounds: number = 3;
    private roundScores: number[] = [0, 0];

    // 점수
    private playerScores: number[] = [0, 0];

    constructor(players: Player[], private messageBroker: IMessageBroker) {
        this.id = 'pingpong-' + uuidv4();
        this.players = players;
        this.onScore = this.onScore.bind(this);
        this.startGame();
    }

    private startGame(): void {
        this.broadcast({
            type: "game_start",
            player1_username: this.players[0].username,
            player2_username: this.players[1].username,
        });
        this.isPlaying = true;
        this.startRound();
    }

    private startRound(): void {
        this.playerScores[0] = 0;
        this.playerScores[1] = 0;

        this.engine = new GameEngine(
            this.players,
            this.onScore,
            (state: any) => this.broadcast({
                type: "game_state",
                game_state: {
                    ...state,
                    score: {
                        player1: this.playerScores[0],
                        player2: this.playerScores[1],
                    }
                }
            })
        )

        this.startCountdown(3, () => {
            this.broadcast({ type: "round_start" });
            this.engine!.start();
        })
    }

    private startCountdown(duration: number, onComplete: () => void): void {
        let count = duration;
        this.broadcast({
            type: "countdown",
            countdown: count,
            player1_username: this.players[0].username,
            player2_username: this.players[1].username,
        });
        count -= 1;
        this.countdownInterval = setInterval(() => {
            if (count > 0) {
                this.broadcast({
                    type: "countdown",
                    countdown: count,
                    player1_username: this.players[0].username,
                    player2_username: this.players[1].username,
                });
                count -= 1;
            } else {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
                onComplete();
            }
        }, 1000);
    }

    private onScore(scoringPlayerIndex: number): void {
        this.playerScores[scoringPlayerIndex] += 1;
        this.broadcast({ type: "score_update", score: { player1: this.playerScores[0], player2: this.playerScores[1] } });
        if (this.playerScores[scoringPlayerIndex] >= this.targetScore) {
            this.endRound(scoringPlayerIndex);
        }
        console.log("flag4");
    }

    private endRound(winnerIndex: number): void {
        this.engine!.stop();
        this.engine = null;

        this.roundScores[winnerIndex] += 1;
        const winner = winnerIndex === 0 ? this.players[0].username : this.players[1].username;

        this.broadcast({
            type: "round_end",
            winner: winner,
            round_score: {
                player1: this.roundScores[0],
                player2: this.roundScores[1],
            }
        });

        setTimeout(() => {
            if (this.currentRound < this.totalRounds) {
                this.currentRound += 1;
                this.startRound();
            } else {
                this.endGame();
            }
        }, 1000);
    }

    private endGame(): void {
        this.isPlaying = false;

        const finalWinner = this.roundScores[0] > this.roundScores[1] ? this.players[0].username : this.players[1].username;

        this.broadcast({
            type: "game_end",
            final_winner: finalWinner,
        });

        this.messageBroker.sendGameResult({
            game_end_reason: "normal",
            player1: {
                id: this.players[0].id,
                round_score: this.roundScores[0],
                result: finalWinner === this.players[0].username ? "winner" : "loser",
            },
            player2: {
                id: this.players[1].id,
                round_score: this.roundScores[1],
                result: finalWinner === this.players[1].username ? "winner" : "loser",
            },
        });
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

    public hasPlayer(player: Player): boolean {
        return this.players.some(p => p.id === player.id);
    }

    public onPlayerDisconnect(disconnectedPlayer: Player): void {
        if (!this.isPlaying) {
            return;
        }

        if (this.countdownInterval !== null) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }

        this.engine?.stop();
        this.engine = null;
        this.isPlaying = false;

        this.players.forEach(p => {
            if (p.id !== disconnectedPlayer.id) {
                p.send({
                    type: "opponent_exit",
                    opponent_username: disconnectedPlayer.username
                });
            }
        });

        const remainingPlayer = this.players.find(p => p.id !== disconnectedPlayer.id);

        this.messageBroker.sendGameResult({
            game_end_reason: "player_disconnected",
            player1: {
                id: this.players[0].id,
                round_score: this.roundScores[0],
                result: (remainingPlayer && this.players[0].id === remainingPlayer.id) ? "winner" : "loser",
            },
            player2: {
                id: this.players[1].id,
                round_score: this.roundScores[1],
                result: (remainingPlayer && this.players[1].id === remainingPlayer.id) ? "winner" : "loser",
            },
        });
    }

    private broadcast(message: any): void {
        this.players.forEach(p => {
            p.send(message);
        });
    }
}
