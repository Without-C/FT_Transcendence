// WaitingScreen.ts
import { Screen } from "./Screen";
import { getScene } from "../canvas/engineCore";
import { setupGUIFor } from "../canvas/guiManager";
import { setWaitingMessage } from "../canvas/guiWaiting";
import { getBallMesh, getPaddle1Mesh, getPaddle2Mesh } from "../canvas/gameObjects";

export class WaitingScreen extends Screen {
  enter(): void {
    console.log("[WaitingScreen] enter()");

    // 오브젝트 숨기기
    getBallMesh().setEnabled(false);
    getPaddle1Mesh().setEnabled(false);
    getPaddle2Mesh().setEnabled(false);

    // GUI 초기화
    setupGUIFor("waiting", getScene());
    setWaitingMessage("🙋‍♂️ Waiting for opponent...");
  }

  update(_delta: number): void {}
  render(): void {}
  exit(): void {}
}
