import { Ball } from "./Ball";
import { Rectangle } from "./Rectangle";
import { Player } from "./Player";
import { KeyState } from "./KeyState";
import { v4 as uuidv4 } from 'uuid'

export class PingPong {
    public id: string;
    private players: Player[];
    private intervalId: NodeJS.Timeout | null = null;

    // 화면 크기
    private readonly width = 600;
    private readonly height = 400;

    // 목표 점수
    private readonly target_score = 3;

    // 라운드
    private currentRound: number = 1;
    private readonly totalRounds: number = 3;
    private player1_round_score: number = 0;
    private player2_round_score: number = 0;

    // 패들
    private readonly paddle_speed = 5
    private readonly paddle_width = 10
    private readonly paddle_height = 100
    private readonly paddle_margin = 30

    // 벽
    private readonly wall_depth = 10;

    // 벽 초기화
    private readonly wall_top = new Rectangle(
        this.width / 2, -this.wall_depth / 2, this.width, this.wall_depth
    );
    private readonly wall_bottom = new Rectangle(
        this.width / 2,
        this.height + this.wall_depth / 2,
        this.width,
        this.wall_depth,
    );
    private readonly wall_left = new Rectangle(
        -this.wall_depth / 2, this.height / 2, this.wall_depth, this.height
    );
    private readonly wall_right = new Rectangle(
        this.width + this.wall_depth / 2,
        this.height / 2,
        this.wall_depth,
        this.height,
    );

    // 공 초기화
    private ball = new Ball(this.width / 2, this.height / 2, 5, 5, 10);

    // 패들 초기화
    private paddle1 = new Rectangle(
        this.paddle_margin, this.height / 2, this.paddle_width, this.paddle_height
    );
    private paddle2 = new Rectangle(
        this.width - this.paddle_margin,
        this.height / 2,
        this.paddle_width,
        this.paddle_height,
    );

    // 점수
    private player1_score = 0;
    private player2_score = 0;

    constructor(players: Player[]) {
        this.id = 'pingpong-' + uuidv4();
        this.players = players;
        this.run();
    }

    private run(): void {
        this.startRound();
    }

    private initRound(): void {
        this.ball = new Ball(this.width / 2, this.height / 2, 5, 5, 10);

        this.paddle1 = new Rectangle(
            this.paddle_margin, this.height / 2, this.paddle_width, this.paddle_height
        );
        this.paddle2 = new Rectangle(
            this.width - this.paddle_margin,
            this.height / 2,
            this.paddle_width,
            this.paddle_height,
        );

        this.player1_score = 0;
        this.player2_score = 0;
    }

    private startRound(): void {
        this.initRound();

        let countdown = 3;
        const countdownInterval = setInterval(() => {
            if (countdown > 0) {
                this.broadcast({ type: "countdown", countdown: countdown });
                countdown -= 1;
            } else {
                clearInterval(countdownInterval);
                this.roundLoop();
            }
        }, 1000);
    }

    private roundLoop(): void {
        this.broadcast({ type: "round_start", });

        this.intervalId = setInterval(() => {
            this.update();
            this.broadcast({
                type: "game_state",
                game_state: {
                    ball: {
                        x: this.ball.x,
                        y: this.ball.y,
                    },
                    paddle1: {
                        x: this.paddle1.x,
                        y: this.paddle1.y,
                        width: this.paddle1.width,
                        height: this.paddle1.height,
                    },
                    paddle2: {
                        x: this.paddle2.x,
                        y: this.paddle2.y,
                        width: this.paddle2.width,
                        height: this.paddle2.height,
                    },
                    score: {
                        player1: this.player1_score,
                        player2: this.player2_score,
                    }
                }
            });

            if (this.player1_score >= this.target_score || this.player2_score >= this.target_score) {
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
                this.endRound();
            }

            this.tick += 1;
        }, 1000 / 60);
    }

    private endRound(): void {
        let winner: string | null = null;
        if (this.player1_score > this.player2_score) {
            winner = "player1";
            this.player1_round_score += 1;
        } else if (this.player2_score > this.player1_score) {
            winner = "player2";
            this.player2_round_score += 1;
        }

        this.broadcast({ type: "round_end", winner: winner });

        if (this.currentRound < this.totalRounds) {
            this.startRound();
            this.currentRound += 1;
        } else {
            this.endGame();
        }
    }

    private endGame(): void {
        let winner: string | null = null;
        if (this.player1_round_score > this.player2_round_score) {
            winner = "player1";
        } else {
            winner = "player2";
        }

        this.broadcast({
            type: "end_game",
            winner: winner,
        });
    }

    private update(): void {
        const paddleKeyPairs: [KeyState, Rectangle][] = [
            [this.players[0].keyState, this.paddle1],
            [this.players[1].keyState, this.paddle2],
        ];

        paddleKeyPairs.forEach(([KeyState, paddle]) => {
            if (KeyState.get("ArrowUp") || KeyState.get("w")) {
                paddle.y -= this.paddle_speed;
            }
            if (KeyState.get("ArrowDown") || KeyState.get("s")) {
                paddle.y += this.paddle_speed;
            }

            const halfHeight = paddle.height / 2;
            paddle.y = Math.max(halfHeight, Math.min(paddle.y, this.height - halfHeight));
        })

        const rects: Rectangle[] = [
            this.wall_top,
            this.wall_bottom,
            this.paddle1,
            this.paddle2,
        ];
        rects.forEach(rect => {
            this.ball.collideWithRect(rect);
        });

        if (this.ball.collideWithRect(this.wall_left)) {
            this.player2_score += 1;
        }

        if (this.ball.collideWithRect(this.wall_right)) {
            this.player1_score += 1;
        }

        this.ball.update();
    }

    public onMessage(from: Player, message: any): void {
        const action = message.action

        if (action === "key") {
            const key = message.key;
            const state = message.state

            for (const player of this.players) {
                if (player.id === from.id) {
                    player.keyState.set(key, state);
                    break;
                }
            }
        }
    }

    public hasPlayer(player: Player): boolean {
        return this.players.some(p => p.id === player.id);
    }

    public onPlayerDisconnect(player: Player): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.players.forEach(p => {
            if (p.id !== player.id) {
                p.send({
                    type: "opponent_exit",
                });
            }
        });
    }

    private broadcast(message: any): void {
        this.players.forEach(p => {
            p.send(message);
        });
    }
}
