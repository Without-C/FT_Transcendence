import { Player } from "../common/Player";
import { GameEngine } from "./GameEngine";

export class DuelManager {
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


    constructor(
        private players: Player[],
        private onEndDuel: (winner: string, roundScores: number[]) => void,
    ) {
        this.onScore = this.onScore.bind(this);
    }

    public startGame(): void {
        this.broadcast({
            type: "game_start",
            player1_username: this.players[0].username,
            player2_username: this.players[1].username,
        });
        this.startRound();
    }

    private endGame(): void {
        const finalWinner = this.roundScores[0] > this.roundScores[1] ? this.players[0].username : this.players[1].username;

        this.broadcast({
            type: "game_end",
            final_winner: finalWinner,
        });

        this.onEndDuel(finalWinner, this.roundScores);
    }

    public haltGame(): number[] {
        this.engine?.stop();
        this.engine = null;

        if (this.countdownInterval !== null) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }

        return this.roundScores;
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
    }

    private broadcast(message: any): void {
        this.players.forEach(p => {
            p.send(message);
        });
    }
}
