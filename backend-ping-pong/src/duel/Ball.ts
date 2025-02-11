import { Rectangle } from './Rectangle'

export class Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;

    constructor(x: number, y: number, vx: number, vy: number, radius: number) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
    }

    update(): void {
        this.x += this.vx;
        this.y += this.vy;
    }

    collideWithRect(rect: Rectangle): boolean {
        const left = rect.x - rect.width / 2;
        const top = rect.y - rect.height / 2;
        const right = rect.x + rect.width / 2;
        const bottom = rect.y + rect.height / 2;

        const closestX = Math.max(left, Math.min(this.x, right));
        const closestY = Math.max(top, Math.min(this.y, bottom));

        const dx = this.x - closestX;
        const dy = this.y - closestY;

        if (dx * dx + dy * dy < this.radius * this.radius) {
            if (Math.abs(dx) > Math.abs(dy)) {
                this.vx = -this.vx;
            } else {
                this.vy = -this.vy;
            }
            return true;
        }
        return false;
    }
}
