import { Scene } from "@babylonjs/core";
import { GameState } from "../core/types";
import { Ball } from "./objects/Ball";
import { Player } from "./objects/Player";
import { Table } from "./objects/Table";

let ball: Ball;
let Player1: Player;
let Player2: Player;
let table: Table;

export function createGameObjects(scene: Scene): void {
  table = new Table(scene);
  ball = new Ball(scene);
  Player1 = new Player(scene, "Player1");
  Player2 = new Player(scene, "Player2");
}

export function updateGameObjects(state: GameState): void {
  ball.update(state.ball.x, state.ball.y, state.ball.z);
  Player1.update(  state.paddle1.x,
    state.paddle1.y,
    state.paddle1.z,
    state.paddle1.width,
    state.paddle1.height);
  Player2.update(  state.paddle2.x,
    state.paddle2.y,
    state.paddle2.z,
    state.paddle2.width,
    state.paddle2.height);
}

export function InvisibleGameObjects(): void {
  ball.mesh.setEnabled(false);
  Player1.mesh.setEnabled(false);
  Player2.mesh.setEnabled(false);
  // table.mesh.setEnabled(false);
}

export function VisibleGameObjects(): void {
  ball.mesh.setEnabled(true);
  Player1.mesh.setEnabled(true);
  Player2.mesh.setEnabled(true);
  // table.mesh.setEnabled(true);
}

export function getBallMesh() {
  return ball.mesh;
}

export function getPlayer1Mesh() {
  return Player1.mesh;
}

export function getPlayer2Mesh() {
  return Player2.mesh;
}
