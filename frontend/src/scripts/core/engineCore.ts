import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
} from "@babylonjs/core";

let engine: Engine;
let scene: Scene;

export function initEngine(canvas: HTMLCanvasElement): { engine: Engine; scene: Scene } {
  engine = new Engine(canvas, true);
  scene = new Scene(engine);

  // θ = 0, φ = 1.0 → 약간 대각선에서 보는 시점
  const camera = new ArcRotateCamera(
    "camera",
    Math.PI / 4, // alpha (좌우 회전)
    Math.PI / 3, // beta (위아래 각도, 90도보다 작게)
    800,         // radius (거리)
    new Vector3(300, 0, 200), // target (중앙)
    scene
  );

  camera.attachControl(canvas, true);

  // beta 제한 완화 (위아래 각도)
  camera.lowerBetaLimit = 0.1;
  camera.upperBetaLimit = Math.PI * 0.49;

  // 줌 범위 설정
  camera.lowerRadiusLimit = 400;
  camera.upperRadiusLimit = 1200;

  // 기본 조명
  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  return { engine, scene };
}

export function getEngine(): Engine {
  return engine;
}

export function getScene(): Scene {
  return scene;
}
