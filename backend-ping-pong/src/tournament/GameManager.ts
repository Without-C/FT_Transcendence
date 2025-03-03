import { v4 as uuidv4 } from 'uuid'

import { Player } from "../common/Player";
import { IMessageBroker } from "../common/IMessageBrocker";
import { IGameManager } from "../common/IGameManager";
import { DuelManager } from '../common/DuelManager';

// FIXME: Duel 끝날 때마다 누가 이겼는지 보여주는 창이 아마 마지막에만 나오는 것 같음
// TODO: 중간에 나가는거 잘 처리하기
export class GameManager implements IGameManager {
    public id: string;
    private isPlaying: boolean = false;
    private duelManager: DuelManager | null = null;

    // TODO: 시작할 때 대진표 보여주기
    constructor(private players: Player[], private messageBroker: IMessageBroker) {
        this.id = 'duel-' + uuidv4();
        this.isPlaying = true;
        this.onEndGame1 = this.onEndGame1.bind(this);
        this.onEndGame2 = this.onEndGame2.bind(this);
        this.onEndGame3 = this.onEndGame3.bind(this);

        this.startGame1();
    }

    // TODO: 재귀로 만들기 (1, 2, 3)
    // TODO: play중이지 않은 사람만 spectator에 넣기
    private startGame1() {
        this.duelManager = new DuelManager([this.players[0], this.players[1]], this.players, this.onEndGame1);
        this.duelManager.startGame();
    }

    // TODO: 끝날 때 마다 중간 결과 보여주기
    // TODO: 중간마다 message queue에 보내지 말고 마지막에 모아서 보내기
    private onEndGame1(winner: string, roundScores: number[]): void {
        this.isPlaying = false;

        this.messageBroker.sendGameResult({
            game_end_reason: "normal",
            player1: {
                id: this.players[0].id,
                round_score: roundScores[0],
                result: winner === this.players[0].username ? "winner" : "loser",
            },
            player2: {
                id: this.players[1].id,
                round_score: roundScores[1],
                result: winner === this.players[1].username ? "winner" : "loser",
            },
        });

        this.startGame2();
    }

    private startGame2() {
        this.duelManager = new DuelManager([this.players[2], this.players[3]], this.players, this.onEndGame2);
        this.duelManager.startGame();
    }

    private onEndGame2(winner: string, roundScores: number[]): void {
        this.isPlaying = false;

        this.messageBroker.sendGameResult({
            game_end_reason: "normal",
            player1: {
                id: this.players[0].id,
                round_score: roundScores[0],
                result: winner === this.players[0].username ? "winner" : "loser",
            },
            player2: {
                id: this.players[1].id,
                round_score: roundScores[1],
                result: winner === this.players[1].username ? "winner" : "loser",
            },
        });

        this.startGame3();
    }

    // TODO: 승자를 결승에서 매치시키기
    private startGame3() {
        this.duelManager = new DuelManager([this.players[0], this.players[2]], this.players, this.onEndGame3);
        this.duelManager.startGame();
    }

    private onEndGame3(winner: string, roundScores: number[]): void {
        this.isPlaying = false;

        this.messageBroker.sendGameResult({
            game_end_reason: "normal",
            player1: {
                id: this.players[0].id,
                round_score: roundScores[0],
                result: winner === this.players[0].username ? "winner" : "loser",
            },
            player2: {
                id: this.players[1].id,
                round_score: roundScores[1],
                result: winner === this.players[1].username ? "winner" : "loser",
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
}
