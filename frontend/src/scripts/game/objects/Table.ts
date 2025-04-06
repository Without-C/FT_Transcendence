import { MeshBuilder, StandardMaterial, Color3, Mesh, Scene } from "@babylonjs/core";

export class Table {
  mesh: Mesh;

  constructor(scene: Scene) {
    this.mesh = MeshBuilder.CreateGround("table", { width: 600, height: 400 }, scene);
    const material = new StandardMaterial("tableMat", scene);
    material.diffuseColor = new Color3(0, 0.5, 0);
    this.mesh.material = material;
  }
}
