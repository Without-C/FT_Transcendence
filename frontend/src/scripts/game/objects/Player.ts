import { MeshBuilder, Mesh, Scene } from "@babylonjs/core";

export class Player {
  mesh: Mesh;

  constructor(scene: Scene, name: string) {
    this.mesh = MeshBuilder.CreateBox(name, { width: 100, height: 20, depth: 10 }, scene);
    this.mesh.position.z = 5;
  }

  update(x: number, y: number, width: number, height: number) {
    this.mesh.scaling.x = width / 100;
    this.mesh.scaling.y = height / 20;
    this.mesh.position.x = x - 300;
    this.mesh.position.y = 200 - y;
  }
}
