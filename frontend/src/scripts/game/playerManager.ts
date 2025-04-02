import { Scene } from "@babylonjs/core";
import { Player } from "./player";
import { GameState } from "../core/types";

let player1: Player;
let player2: Player;

export function createPlayers(scene: Scene, localPlayerId: number): void {
  // id: 1 또는 2, 로컬플레이어 판별
  player1 = new Player(1, scene, localPlayerId === 1);
  player2 = new Player(2, scene, localPlayerId === 2);
}

export function getPlayer1(): Player {
  return player1;
}

export function getPlayer2(): Player {
  return player2;
}

export function disposePlayers(): void {
  player1?.dispose();
  player2?.dispose();
}

export function updatePlayersFromGameState(state: GameState) {
  player1.updatePosition(state.paddle1.x, state.paddle1.y);
  player2.updatePosition(state.paddle2.x, state.paddle2.y);
}
