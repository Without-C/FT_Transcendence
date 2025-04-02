import {
  MeshBuilder,
  Mesh,
  Scene,
  StandardMaterial,
  Color3,
  Vector3,
  FollowCamera
} from "@babylonjs/core";

export function createPlayerMesh(id: number, scene: Scene): Mesh {
  const mesh = MeshBuilder.CreateBox(`paddle${id}`, {
    width: 100,
    height: 20,
    depth: 10,
  }, scene);

  const mat = new StandardMaterial(`paddleMat${id}`, scene);
  mat.diffuseColor = id === 1 ? Color3.Blue() : Color3.Red();
  mesh.material = mat;
  mesh.position = new Vector3(0, 0, 5);
  return mesh;
}

export function getPlayerCamera(mesh: Mesh, scene: Scene): FollowCamera {
  const camera = new FollowCamera(`playerCam${mesh.name}`, new Vector3(0, 50, -150), scene);
  camera.lockedTarget = mesh;
  camera.heightOffset = 30;
  camera.radius = 120;
  camera.rotationOffset = 180;
  return camera;
}
