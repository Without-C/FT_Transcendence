import { IGameManager } from "./IGameManager";
import { KeyState } from "./KeyState";

export class Player {
    public id: string;
    public username: string;
    public ws: any;
    public keyState: KeyState;
    public game: IGameManager | null = null;
    private isAlive: boolean = true;

    constructor(id: string, username: string, ws: any) {
        this.id = id;
        this.username = username;
        this.ws = ws;
        this.keyState = new KeyState();
    }

    public send(message: any): void {
        this.ws.send(JSON.stringify(message))
    }

    public getIsAlive(): boolean {
        return this.isAlive;
    }

    public die() {
        this.isAlive = false;
    }
}
