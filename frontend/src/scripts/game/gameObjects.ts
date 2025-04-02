import { Scene } from "@babylonjs/core";
import { GameState } from "../core/types";
import { createPlayers, getPlayer1, updatePlayersFromGameState } from "./playerManager";
import {
  createBall,
  updateBall,
  getBallMesh,
} from "./ball";

import {
  createTable,
  getTableMesh,
  getNetMesh,
} from "./table";

// import { createPaddle1, updatePaddle1, getPaddle1Mesh } from "./paddle1";
// import { createPaddle2, updatePaddle2, getPaddle2Mesh } from "./paddle2";

export function createGameObjects(scene: Scene): void {
  createTable(scene);
  createBall(scene);
  createPlayers(scene, 1);
  // createPaddle1(scene);
  // createPaddle2(scene);
}

export function updateGameObjects(state: GameState): void {
  updateBall(state);
  updatePlayersFromGameState(state);
  // updatePaddle1(state.paddle1);
  // updatePaddle2(state.paddle2);
}

// ✅ 모든 오브젝트 보여주기
export function showGameObjects(): void {
  getBallMesh().setEnabled(true);
  getTableMesh().setEnabled(true);
  getNetMesh().setEnabled(true);
}

// ✅ 모든 오브젝트 숨기기
export function hideGameObjects(): void {
  getBallMesh().setEnabled(false);
  getTableMesh().setEnabled(false);
  getNetMesh().setEnabled(false);
}

// 필요한 메쉬 getter export
export {
  getBallMesh,
  getPlayer1
};
