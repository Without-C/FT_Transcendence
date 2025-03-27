// gameObjects.ts
import {
    Mesh,
    MeshBuilder,
    Color3,
    StandardMaterial,
    Scene
  } from "@babylonjs/core";
  import { GameState } from "../core/types";
  
  let ballMesh: Mesh;
  let paddle1Mesh: Mesh;
  let paddle2Mesh: Mesh;
  
  export function createGameObjects(scene: Scene): void {
    const table = MeshBuilder.CreateGround("table", { width: 600, height: 400 }, scene);
    const tableMat = new StandardMaterial("tableMat", scene);
    tableMat.diffuseColor = new Color3(0, 0.5, 0);
    table.material = tableMat;
  
    ballMesh = MeshBuilder.CreateSphere("ball", { diameter: 20 }, scene);
    ballMesh.position.z = 10;
  
    paddle1Mesh = MeshBuilder.CreateBox("paddle1", { width: 100, height: 20, depth: 10 }, scene);
    paddle1Mesh.position.z = 5;
  
    paddle2Mesh = MeshBuilder.CreateBox("paddle2", { width: 100, height: 20, depth: 10 }, scene);
    paddle2Mesh.position.z = 5;
  }
  
  export function updateGameObjects(state: GameState): void {
    const { ball, paddle1, paddle2 } = state;
  
    // Ball position
    ballMesh.position.x = ball.x - 300;
    ballMesh.position.y = 200 - ball.y;
  
    // Paddle update function
    const updatePaddle = (mesh: Mesh, paddle: typeof paddle1) => {
      mesh.scaling.x = paddle.width / 100;
      mesh.scaling.y = paddle.height / 20;
      mesh.position.x = paddle.x - 300;
      mesh.position.y = 200 - paddle.y;
    };
  
    updatePaddle(paddle1Mesh, paddle1);
    updatePaddle(paddle2Mesh, paddle2);
  }
  
  export function getBallMesh(): Mesh {
    return ballMesh;
  }
  
  export function getPaddle1Mesh(): Mesh {
    return paddle1Mesh;
  }
  
  export function getPaddle2Mesh(): Mesh {
    return paddle2Mesh;
  }
  