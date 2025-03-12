import { GameManager } from "./GameManager";

import { IGameManager } from "../common/IGameManager";
import { IGameManagerFactory } from "../common/IGameManagerFactory";
import { IMessageBroker } from "../common/IMessageBrocker";
import { Player } from "../common/Player";

export class GameManagerFactory implements IGameManagerFactory {
    constructor(private messageBroker: IMessageBroker) { }

    createGameManager(players: Player[]): IGameManager {
        return new GameManager(players, this.messageBroker);
    }
}