export class KeyState {
    private keyState: Record<string, boolean>;

    constructor() {
        this.keyState = {};
    }

    public set(key: string, state: 'press' | 'release'): void {
        if (state === 'press') {
            this.keyState[key] = true;
        } else if (state === 'release') {
            this.keyState[key] = false;
        }
    }

    public get(key: string): boolean {
        return this.keyState[key] ?? false;
    }
    
    public isUp(): boolean {
        return this.get("ArrowUp") || this.get("w");
    }
    
    public isDown(): boolean {
        return this.get("ArrowDown") || this.get("s");
    }
    
}