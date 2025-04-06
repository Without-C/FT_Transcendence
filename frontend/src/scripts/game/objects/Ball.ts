import { MeshBuilder, Mesh, Scene } from "@babylonjs/core";

export class Ball {
  mesh: Mesh;

  constructor(scene: Scene) {
    this.mesh = MeshBuilder.CreateSphere("ball", { diameter: 20 }, scene);
    this.mesh.position.z = 10;
  }

  update(x: number, y: number) {
    this.mesh.position.x = x - 300;
    this.mesh.position.y = 200 - y;
  }
}
