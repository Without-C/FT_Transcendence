import { Ball } from "./Ball";
import { Rectangle } from "./Rectangle";
import { KeyState } from "./KeyState";
import { Player } from "./Player";

export class GameEngine {
    private intervalId: NodeJS.Timeout | null = null;

    // 화면 크기
    private readonly width = 600;
    private readonly height = 400;

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
    private ballIsMoving = false;
    private ballTurn = 0;

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

    constructor(
        private players: Player[],
        private onScore: (scoringPlayerIndex: number) => void,
        private onGameStateUpdate: (state: any) => void,
    ) { }

    public resetRound(): void {
        this.ball = new Ball(this.width / 2, this.height / 2, 5, 5, 10);
        this.ballIsMoving = false;

        this.paddle1 = new Rectangle(
            this.paddle_margin, this.height / 2, this.paddle_width, this.paddle_height
        );
        this.paddle2 = new Rectangle(
            this.width - this.paddle_margin,
            this.height / 2,
            this.paddle_width,
            this.paddle_height,
        );
    }

    public start(): void {
        this.intervalId = setInterval(() => {
            this.update()
            this.onGameStateUpdate({
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
            });
        }, 1000 / 60);
    }

    public stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private update(): void {
        // paadle
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

        // ball
        if (!this.ballIsMoving) {
            if (this.ballTurn == 0) {
                this.ball.x = this.paddle_margin * 2;
                this.ball.y = this.paddle1.y;
            } else {
                this.ball.x = this.width - this.paddle_margin * 2;
                this.ball.y = this.paddle2.y;
            }
            this.ball.vx = 0;
            this.ball.vy = 0;
        }
        if (!this.ballIsMoving && this.players[this.ballTurn].keyState.get(" ")) {
            this.ballIsMoving = true;
            if (this.ballTurn == 0) {
                this.ball.vx = 5;
                this.ball.vy = 5;
            } else {
                this.ball.vx = -5;
                this.ball.vy = 5;
            }
        }

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
            this.onScore(1);
            this.ballIsMoving = false;
            this.ballTurn = 1 - this.ballTurn;
        }

        if (this.ball.collideWithRect(this.wall_right)) {
            this.onScore(0);
            this.ballIsMoving = false;
            this.ballTurn = 1 - this.ballTurn;
        }

        this.ball.update();
    }
}