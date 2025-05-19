import { MeshBuilder, Mesh, Scene, Vector3 } from "@babylonjs/core";

export class Ball {
  mesh: Mesh;

  constructor(scene: Scene) {
    this.mesh = MeshBuilder.CreateSphere("ball", { diameter: 20 }, scene);
    this.mesh.position = new Vector3(0, 0, 0);
  }

  update(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }
}
