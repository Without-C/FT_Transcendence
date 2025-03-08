import { v4 as uuidv4 } from 'uuid'

import { Player } from "../common/Player";
import { IMessageBroker } from "../common/IMessageBrocker";
import { IGameManager } from "../common/IGameManager";
import { DuelManager } from '../common/DuelManager';

type GameResult = {
    game_end_reason: string,
    player1: {
        id: string,
        round_score: number,
        result: string,
    },
    player2: {
        id: string,
        round_score: number,
        result: string,
    },
}

// FIXME: Duel 끝날 때마다 누가 이겼는지 보여주는 창이 아마 마지막에만 나오는 것 같음
// TODO: 중간에 나가는거 잘 처리하기
export class GameManager implements IGameManager {
    public id: string;
    private isPlaying: boolean = false;
    private duelManager: DuelManager | null = null;
    private matches: Player[][] = [];
    private gameResults: GameResult[] = [];
    private currentRound: number = 0;

    constructor(private players: Player[], private messageBroker: IMessageBroker) {
        this.id = 'duel-' + uuidv4();
        this.isPlaying = true;
        this.onEndRound = this.onEndRound.bind(this);

        this.players = this.shufflePlayers(this.players);
        this.matches = this.initMatches(this.players);

        this.startTournament();
    }

    private startTournament() {
        this.broadcast({ type: "tournament_start" });
        this.startRound();
    }

    private startRound() {
        const player1: Player = this.matches[this.currentRound][0];
        const player2: Player = this.matches[this.currentRound][1];

        // FIXME: tournament에서 countdown할 때 맨 처음에 tournament 항목이 없어서 3이 안 나옴
        this.duelManager = new DuelManager([player1, player2], this.players, this.currentRound, this.onEndRound);
        this.duelManager.startGame();
    }

    private onEndRound(winner_username: string, roundScores: number[]): void {
        this.gameResults.push({
            game_end_reason: "normal",
            player1: {
                id: this.players[0].id,
                round_score: roundScores[0],
                result: winner_username === this.players[0].username ? "winner" : "loser",
            },
            player2: {
                id: this.players[1].id,
                round_score: roundScores[1],
                result: winner_username === this.players[1].username ? "winner" : "loser",
            },
        });

        this.currentRound += 1;
        const winner = this.getPlayer(this.players, winner_username);
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

    private shufflePlayers(players: Player[]): Player[] {
        const shuffled = [...players];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    private initMatches(players: Player[]): Player[][] {
        const matches: Player[][] = [];
        for (let i = 0; i < players.length; i += 2) {
            matches.push([players[i], players[i + 1]]);
        }
        return matches;
    }

    private getPlayer(players: Player[], username: string): Player | undefined {
        return players.find(player => player.username === username);
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

        this.messageBroker.sendGameResult({
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
        });

        return true;
    }

    private broadcast(message: any): void {
        this.players.forEach(p => {
            p.send(message);
        });
    }
}
