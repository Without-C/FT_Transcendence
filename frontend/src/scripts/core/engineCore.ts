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
  
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 500, new Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    camera.lowerBetaLimit = Math.PI / 2;
    camera.upperBetaLimit = Math.PI / 2;
    camera.lowerRadiusLimit = 500;
    camera.upperRadiusLimit = 500;
  
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  
    return { engine, scene };
  }
  
  export function getEngine(): Engine {
    return engine;
  }
  
  export function getScene(): Scene {
    return scene;
  }
  