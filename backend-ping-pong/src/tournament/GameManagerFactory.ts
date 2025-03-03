// import { GameManager } from "./GameManager"; TODO:
import { GameManager } from "../duel/GameManager";

import { IGameManager } from "../common/IGameManager";
import { IGameManagerFactory } from "../common/IGameManagerFactory";
import { IMessageBroker } from "../common/IMessageBrocker";
import { Player } from "../common/Player";

export class GameManagerFactory implements IGameManagerFactory {
    constructor(private messageBroker: IMessageBroker) { }

    createGameManager(players: Player[]): IGameManager {
        console.log("rooooooomm"); // TODO:
        return new GameManager(players, this.messageBroker);
    }
}

// TODO: GameManager 만들기
// TODO: GameEngine은 추상화 잘 해서 다시 써먹기