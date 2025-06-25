import { Ball } from "../common/Ball";
import { BoxCollider } from "../common/BoxCollider";
import { KeyState } from "../common/KeyState";
import { Player } from "../common/Player";

export class GameEngine {
    private intervalId: NodeJS.Timeout | null = null;

    private readonly width = 600;
    private readonly depth = 400; // 2D의 height → 3D의 z축
    private readonly paddle_speed = 5;
    private readonly paddle_width = 10;
    private readonly paddle_height = 20;
    private readonly paddle_depth = 100;
    private readonly paddle_margin = 30;
    private readonly wall_thickness = 10;

    // 벽
    private readonly wall_top = new BoxCollider(this.width / 2, 0, -this.wall_thickness / 2, this.width, 20, this.wall_thickness);
    private readonly wall_bottom = new BoxCollider(this.width / 2, 0, this.depth + this.wall_thickness / 2, this.width, 20, this.wall_thickness);
    private readonly wall_left = new BoxCollider(-this.wall_thickness / 2, 0, this.depth / 2, this.wall_thickness, 20, this.depth);
    private readonly wall_right = new BoxCollider(this.width + this.wall_thickness / 2, 0, this.depth / 2, this.wall_thickness, 20, this.depth);

    private ball = new Ball(this.width / 2, 2, this.depth / 2, 5, 0, 5, 10); // y = 높이
    private ballIsMoving = false;
    private ballTurn = 0;

    private paddle1 = new BoxCollider(this.paddle_margin, 2, this.depth / 2, this.paddle_width, this.paddle_height, this.paddle_depth);
    private paddle2 = new BoxCollider(this.width - this.paddle_margin, 2, this.depth / 2, this.paddle_width, this.paddle_height, this.paddle_depth);

    constructor(
        private players: Player[],
        private onScore: (scoringPlayerIndex: number) => void,
        private onGameStateUpdate: (state: any) => void,
    ) { }

    public resetRound(): void {
        this.ball = new Ball(this.width / 2, 2, this.depth / 2, 0, 0, 0, 10);
        this.ballIsMoving = false;

        this.paddle1 = new BoxCollider(this.paddle_margin, 2, this.depth / 2, this.paddle_width, this.paddle_height, this.paddle_depth);
        this.paddle2 = new BoxCollider(this.width - this.paddle_margin, 2, this.depth / 2, this.paddle_width, this.paddle_height, this.paddle_depth);
    }

    public start(): void {
        this.intervalId = setInterval(() => {
            this.update();
            this.onGameStateUpdate({
                ball: {
                    x: this.ball.x,
                    y: this.ball.y,
                    z: this.ball.z,
                },
                paddle1: {
                    x: this.paddle1.x,
                    y: this.paddle1.y,
                    z: this.paddle1.z,
                    width: this.paddle1.width,
                    height: this.paddle1.height,
                    depth: this.paddle1.depth,
                },
                paddle2: {
                    x: this.paddle2.x,
                    y: this.paddle2.y,
                    z: this.paddle2.z,
                    width: this.paddle2.width,
                    height: this.paddle2.height,
                    depth: this.paddle2.depth,
                },
                username: {
                    player1: this.players[0].username,
                    player2: this.players[1].username,
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
        // 패들 이동 (z축)
        const paddleKeyPairs: [KeyState, BoxCollider][] = [
            [this.players[0].keyState, this.paddle1],
            [this.players[1].keyState, this.paddle2],
        ];

        paddleKeyPairs.forEach(([keyState, paddle]) => {
            if (keyState.get("ArrowUp") || keyState.get("w")) {
                paddle.z -= this.paddle_speed;
            }
            if (keyState.get("ArrowDown") || keyState.get("s")) {
                paddle.z += this.paddle_speed;
            }

            const halfDepth = paddle.depth / 2;
            paddle.z = Math.max(halfDepth, Math.min(paddle.z, this.depth - halfDepth));
        });

        // 공 위치 초기화
        if (!this.ballIsMoving) {
            if (this.ballTurn == 0) {
                this.ball.x = this.paddle_margin * 2;
                this.ball.z = this.paddle1.z;
            } else {
                this.ball.x = this.width - this.paddle_margin * 2;
                this.ball.z = this.paddle2.z;
            }
            this.ball.vx = 0;
            this.ball.vz = 0;
        }

        if (!this.ballIsMoving && this.players[this.ballTurn].keyState.get(" ")) {
            this.ballIsMoving = true;

            const serveSpeed = 5;
            const centerAngle = this.ballTurn == 0 ? 0 : Math.PI;
            const angleRange = Math.PI / 4;
            const theta = centerAngle + (Math.random() * 2 - 1) * angleRange;
            this.ball.vx = serveSpeed * Math.cos(theta);
            this.ball.vz = serveSpeed * Math.sin(theta);
            this.ball.vy = 0;
        }

        const colliders: BoxCollider[] = [
            this.wall_top,
            this.wall_bottom,
            this.paddle1,
            this.paddle2,
        ];

        colliders.forEach(box => {
            this.ball.collideWithBox(box);
        });

        if (this.ball.collideWithBox(this.wall_left)) {
            this.onScore(1);
            this.ballIsMoving = false;
            this.ballTurn = 1 - this.ballTurn;
        }

        if (this.ball.collideWithBox(this.wall_right)) {
            this.onScore(0);
            this.ballIsMoving = false;
            this.ballTurn = 1 - this.ballTurn;
        }

        this.ball.update();
    }
}
