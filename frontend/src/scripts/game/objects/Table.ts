import { MeshBuilder, StandardMaterial, Color3, Mesh, Scene, Vector3 } from "@babylonjs/core";

export class Table {
  mesh: Mesh;
  private readonly width = 600;
  private readonly depth = 400;
  private readonly height = 10;

  constructor(scene: Scene) {
    this.mesh = MeshBuilder.CreateBox("table", {
      width: this.width,
      height: this.height,
      depth: this.depth,
    }, scene);

    const material = new StandardMaterial("tableMat", scene);
    material.diffuseColor = new Color3(0, 0.5, 0);
    this.mesh.material = material;

    this.mesh.position = new Vector3(
      this.width / 2,
      -this.height / 2,
      this.depth / 2
    );
  }
}
