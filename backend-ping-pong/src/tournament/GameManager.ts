import { v4 as uuidv4 } from 'uuid'

import { Player } from "../common/Player";
import { IMessageBroker } from "../common/IMessageBrocker";
import { IGameManager } from "../common/IGameManager";
import { DuelManager } from '../common/DuelManager';
import { GameResult } from '../common/GameResult';

export class GameManager implements IGameManager {
    public id: string;
    private isPlaying: boolean = true;
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

        // 시작하기 전에 이 유저가 살아있는지 확인
        if (!player1.getIsAlive()) {
            this.broadcastPlayerExit(player1);
            this.onEndRound(player2, [0, 0], "player_disconnected")
            return;
        } else if (!player2.getIsAlive()) {
            this.broadcastPlayerExit(player2);
            this.onEndRound(player1, [0, 0], "player_disconnected")
            return;
        }

        // 게임 생성 후 시작
        this.duelManager = new DuelManager([player1, player2], this.players, this.currentRound, this.onEndRound);
        this.duelManager.startGame();
    }

    private onEndRound(winner: Player, roundScores: number[], reason: string): void {
        this.gameResults.push({
            game_end_reason: reason,
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
                this.matches.push([winner]);
                this.startRound();
                break;
            case 2:
                this.matches[2].push(winner);
                this.startRound();
                break;
            case 3:
                this.endTournament(winner);
                break;
        }
    }

    private endTournament(winner: Player) {
        this.isPlaying = false;
        this.broadcast({ type: "tournament_end", winner: winner.username });
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

    public isPlayingUser(player: Player): boolean {
        return this.currentPlayers.some(currentPlayer => currentPlayer.id === player.id);
    }

    public onPlayerDisconnect(disconnectedPlayer: Player): boolean {
        // 이 게임에 속해있지 않은 유저라면 return
        if (!this.players.some(p => p.id === disconnectedPlayer.id)) {
            return false;
        }

        // 게임이 이미 끝난 상태라면 return
        if (!this.isPlaying) {
            return true;
        }

        // 이 유저가 플레이 중이지 않다면 return
        if (!this.isPlayingUser(disconnectedPlayer)) {
            return true;
        }

        // 현재 진행중인 게임 종료
        const roundScores = this.duelManager!.haltGame();

        // 상대방이 나갔다고 알림
        this.broadcastPlayerExit(disconnectedPlayer);

        // 1초 뒤 다음 게임 시작
        setTimeout(() => {
            const winner = this.currentPlayers.find(player =>
                player.id !== disconnectedPlayer.id);
            this.onEndRound(winner!, roundScores, "player_disconnected")
        }, 1000)

        return true;
    }

    private broadcast(message: any): void {
        this.players.forEach(p => {
            p.send(message);
        });
    }

    private broadcastPlayerExit(disconnectedPlayer: Player) {
        this.players.forEach(p => {
            if (p.id !== disconnectedPlayer.id) {
                p.send({
                    type: "opponent_exit",
                    opponent_username: disconnectedPlayer.username
                });
            }
        });
    }

    public getAlivePlayerNumber(): number {
        return this.currentPlayers.filter(player => player.getIsAlive()).length;
    }
}
