import { FollowCamera, Scene, Vector3, Mesh } from "@babylonjs/core";

export function createPlayerCamera(scene: Scene, target: Mesh, isLocalPlayer: boolean): FollowCamera {
  const cam = new FollowCamera("PlayerCamera", new Vector3(0, 50, -200), scene);
  cam.radius = 200;
  cam.heightOffset = 30;
  cam.rotationOffset = isLocalPlayer ? 0 : 180; // 적 시점이면 반대
  cam.lockedTarget = target;
  return cam;
}
