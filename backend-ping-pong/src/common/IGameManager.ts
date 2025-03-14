import { Player } from "./Player";

export interface IGameManager {
    id: string;
    onMessage(from: Player, message: any): void;
    onPlayerDisconnect(player: Player): boolean;
    getAlivePlayerNumber(): number;
}
