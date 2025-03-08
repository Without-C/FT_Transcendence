import { IGameManager } from "./IGameManager";
import { Player } from "./Player";

export interface IGameManagerFactory {
    createGameManager(players: Player[]): IGameManager;
}