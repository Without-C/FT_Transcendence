import { Player } from "./Player";

export interface IGameManager {
    id: string;
    onMessage(from: Player, message: any): void;
    hasPlayer(player: Player): boolean;
    onPlayerDisconnect(player: Player): void;
}
