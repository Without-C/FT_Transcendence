import {
    MeshBuilder,
    Mesh,
    Scene,
    StandardMaterial,
    Color3,
    Vector3,
  } from "@babylonjs/core";
  
  let tableMesh: Mesh;
  let netMesh: Mesh;
  
  export function createTable(scene: Scene): void {
    tableMesh = MeshBuilder.CreateGround("table", {
      width: 600,
      height: 400,
    }, scene);
  
    const tableMat = new StandardMaterial("tableMaterial", scene);
    tableMat.diffuseColor = new Color3(0.0, 0.5, 0.0); // 초록색 테이블
    tableMesh.material = tableMat;
  
    netMesh = MeshBuilder.CreateBox("net", {
      width: 2,
      height: 20,
      depth: 400,
    }, scene);
  
    netMesh.position = new Vector3(0, 10, 0);
    const netMat = new StandardMaterial("netMaterial", scene);
    netMat.diffuseColor = new Color3(1, 1, 1);
    netMesh.material = netMat;
  }
  
  export function getTableMesh(): Mesh {
    return tableMesh;
  }
  
  export function getNetMesh(): Mesh {
    return netMesh;
  }
  