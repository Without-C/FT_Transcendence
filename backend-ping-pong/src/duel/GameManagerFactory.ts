import { IGameManager } from "../common/IGameManager";
import { IGameManagerFactory } from "../common/IGameManagerFactory";
import { IMessageBroker } from "../common/IMessageBrocker";
import { Player } from "../common/Player";
import { GameManager } from "./GameManager";

export class GameManagerFactory implements IGameManagerFactory {
    constructor(private messageBroker: IMessageBroker) { }

    createGameManager(players: Player[]): IGameManager {
        return new GameManager(players, this.messageBroker);
    }
}