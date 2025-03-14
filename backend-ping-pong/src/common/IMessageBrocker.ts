import { GameResult } from "./GameResult";

export interface IMessageBroker {
    sendGameResult(message: GameResult[]): void;
}
