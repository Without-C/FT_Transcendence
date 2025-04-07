export class BoxCollider {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;

    constructor(
        x: number,
        y: number,
        z: number,
        width: number,
        height: number,
        depth: number
    ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    /**
     * 공의 중심과 충돌 여부 판단
     */
    isPointInside(px: number, py: number, pz: number): boolean {
        const left   = this.x - this.width / 2;
        const right  = this.x + this.width / 2;
        const bottom = this.y - this.height / 2;
        const top    = this.y + this.height / 2;
        const front  = this.z - this.depth / 2;
        const back   = this.z + this.depth / 2;

        return (
            px >= left &&
            px <= right &&
            py >= bottom &&
            py <= top &&
            pz >= front &&
            pz <= back
        );
    }

    /**
     * Box와 Sphere 충돌 여부 판단 (AABB vs Sphere)
     */
    isSphereColliding(sx: number, sy: number, sz: number, radius: number): boolean {
        const closestX = Math.max(this.x - this.width / 2, Math.min(sx, this.x + this.width / 2));
        const closestY = Math.max(this.y - this.height / 2, Math.min(sy, this.y + this.height / 2));
        const closestZ = Math.max(this.z - this.depth / 2, Math.min(sz, this.z + this.depth / 2));

        const dx = sx - closestX;
        const dy = sy - closestY;
        const dz = sz - closestZ;

        return dx * dx + dy * dy + dz * dz < radius * radius;
    }
}
