import { MeshBuilder, Mesh, Scene, Vector3, StandardMaterial, Color3 } from "@babylonjs/core";

export class Paddle {
  mesh: Mesh;
  private readonly width = 10;
  private readonly height = 20;
  private readonly depth = 100;

  constructor(scene: Scene, name: string) {
    this.mesh = MeshBuilder.CreateBox(name, {
      width: this.width,
      height: this.height,
      depth: this.depth,
    }, scene);

    this.mesh.position = new Vector3(0, 0, 0);

    // 선택사항: 색상 지정
    const mat = new StandardMaterial("paddleMat", scene);
    mat.diffuseColor = name === "paddle1" ? new Color3(1, 0, 0) : new Color3(0, 0, 1);
    this.mesh.material = mat;
  }

  update(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }
}
