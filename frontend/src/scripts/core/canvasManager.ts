import { initEngine } from "./engineCore";
import { createGameObjects } from "../game/gameObjects";
import { startRenderLoop } from "./renderLoop";
import { resetGameState } from "./stateManager";
import { changeScreen } from "../screens/screenManager";
import { WaitingScreen } from "../screens/WaitingScreen";

export function initCanvas(): void {
  const canvas = document.getElementById("ping-ping") as HTMLCanvasElement;
  const { engine, scene } = initEngine(canvas);
  createGameObjects(scene);
  changeScreen(new WaitingScreen()); // 초기 화면을 Waiting으로 설정
  startRenderLoop();
}

export function resetCanvas(): void {
  resetGameState();
}
