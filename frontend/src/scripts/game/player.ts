import { Mesh } from "@babylonjs/core";
import { createPlayerMesh } from "./playerGraphic";
import { createPlayerCamera } from "./playerCamera";
import { Scene } from "@babylonjs/core";
import { FollowCamera } from "@babylonjs/core";

export class Player {
    private id: number;
  private mesh: Mesh;
  private camera: FollowCamera;

  constructor(id: number, private scene: Scene, private isLocalPlayer: boolean) {
    this.id = id;
    this.mesh = createPlayerMesh(id, scene);
    this.camera = createPlayerCamera(scene, this.mesh, isLocalPlayer);
  }

  public getMesh(): Mesh {
    return this.mesh;
  }

  public activateCamera(): void {
    if (this.isLocalPlayer) {
      this.scene.activeCamera = this.camera;
      this.camera.attachControl(true);
    }
  }

  public deactivateCamera(): void {
    if (this.isLocalPlayer) {
      this.camera.detachControl();
    }
  }

  public updatePosition(x: number, y: number): void {
    this.mesh.position.x = x - 300;
    this.mesh.position.y = 200 - y;
  }

  public dispose(): void {
    this.mesh.dispose();
    this.deactivateCamera();
  }
}
