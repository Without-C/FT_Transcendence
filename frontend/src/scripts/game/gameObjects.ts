import { Scene } from "@babylonjs/core";
import { GameState } from "../core/types";
import { Ball } from "./objects/Ball";
import { Paddle } from "./objects/Paddle";
import { Table } from "./objects/Table";

let ball: Ball;
let paddle1: Paddle;
let paddle2: Paddle;
let table: Table;

export function createGameObjects(scene: Scene): void {
  table = new Table(scene);
  ball = new Ball(scene);
  paddle1 = new Paddle(scene, "paddle1");
  paddle2 = new Paddle(scene, "paddle2");
}

export function updateGameObjects(state: GameState): void {
  const { ball: b } = state;

  ball.update(b.x, b.y, b.z);
  paddle1.update(state.paddle1.x, state.paddle1.y, state.paddle1.z);
  paddle2.update(state.paddle2.x, state.paddle2.y, state.paddle2.z);
}

export function InvisibleGameObjects(): void {
  ball.mesh.setEnabled(false);
  paddle1.mesh.setEnabled(false);
  paddle2.mesh.setEnabled(false);
  table.mesh.setEnabled(false); // Table 클래스도 mesh 속성이 있다고 가정
}

export function VisibleGameObjects(): void {
  ball.mesh.setEnabled(true);
  paddle1.mesh.setEnabled(true);
  paddle2.mesh.setEnabled(true);
  table.mesh.setEnabled(true);
}

export function getBallMesh() {
  return ball.mesh;
}

export function getPaddle1Mesh() {
  return paddle1.mesh;
}

export function getPaddle2Mesh() {
  return paddle2.mesh;
}
