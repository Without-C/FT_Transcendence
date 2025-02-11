import { KeyState } from "./KeyState";
import { PingPong } from "./PingPong";
import { v4 as uuidv4 } from 'uuid'

export class Player {
    public id: string;
    public ws: any;
    public keyState: KeyState;
    public game: PingPong | null = null;

    constructor(ws: any) {
        this.id = 'player-' + uuidv4();
        this.ws = ws;
        this.keyState = new KeyState();
    }

    public send(message: any): void {
        this.ws.send(JSON.stringify(message))
    }
}
