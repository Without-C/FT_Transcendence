import { BoxCollider } from './BoxCollider';

export class Ball {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    radius: number;

    constructor(x: number, y: number, z: number, vx: number, vy: number, vz: number, radius: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.radius = radius;
    }

    update(): void {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
    }

    collideWithBox(box: BoxCollider): boolean {
        const left   = box.x - box.width / 2;
        const right  = box.x + box.width / 2;
        const top    = box.y + box.height / 2;
        const bottom = box.y - box.height / 2;
        const front  = box.z - box.depth / 2;
        const back   = box.z + box.depth / 2;

        const closestX = Math.max(left, Math.min(this.x, right));
        const closestY = Math.max(bottom, Math.min(this.y, top));
        const closestZ = Math.max(front, Math.min(this.z, back));

        const dx = this.x - closestX;
        const dy = this.y - closestY;
        const dz = this.z - closestZ;

        if (dx * dx + dy * dy + dz * dz < this.radius * this.radius) {
            // 반사 방향 결정
            if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) >= Math.abs(dz)) {
                this.vx = -this.vx;
            } else if (Math.abs(dy) >= Math.abs(dx) && Math.abs(dy) >= Math.abs(dz)) {
                this.vy = -this.vy;
            } else {
                this.vz = -this.vz;
            }
            return true;
        }
        return false;
    }
}
