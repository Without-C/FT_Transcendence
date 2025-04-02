import {
    MeshBuilder,
    Mesh,
    Scene,
    Color3,
    StandardMaterial,
    Vector3,
    FollowCamera,
  } from "@babylonjs/core";
  
  import { GameState } from "../core/types";
  
  let ballMesh: Mesh;
  let ballCamera: FollowCamera;
  
  function createDefaultBall(scene: Scene): Mesh {
    const mesh = MeshBuilder.CreateSphere("ball", { diameter: 20 }, scene);
    const mat = new StandardMaterial("ballMaterial", scene);
    mat.diffuseColor = Color3.Yellow();
    mesh.material = mat;
    mesh.position = new Vector3(0, 10, 0);
    return mesh;
  }
  
  function createBallWithAsset(scene: Scene): Mesh {
    const useCustomAsset = false;
    if (useCustomAsset) {
    }
    return createDefaultBall(scene);
  }
  
  export function createBall(scene: Scene): void {
    ballMesh = createBallWithAsset(scene);
  }
  
  export function updateBall(state: GameState ): void {
    if (!ballMesh) return;
    ballMesh.position.x = state.ball.x - 300;
    ballMesh.position.y = 200 - state.ball.y;
  }
  
  export function createBallCamera(scene: Scene): void {
    ballCamera = new FollowCamera("ballCamera", new Vector3(0, 50, -200), scene);
    ballCamera.radius = 150;
    ballCamera.heightOffset = 20;
    ballCamera.rotationOffset = 180;
    ballCamera.lockedTarget = ballMesh;
  }
  
  export function getBallMesh(): Mesh {
    return ballMesh;
  }
  
  export function getBallCamera(): FollowCamera {
    return ballCamera;
  }
  