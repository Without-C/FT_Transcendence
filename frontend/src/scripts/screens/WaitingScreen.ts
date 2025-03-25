import { Screen } from "./Screen";
import { getScene } from "../canvas/engineCore";
import { setupWaitingGUI, setWaitingMessage, disposeWaitingGUI } from "../canvas/guiWaiting";
import { getBallMesh, getPaddle1Mesh, getPaddle2Mesh } from "../canvas/gameObjects";

export class WaitingScreen extends Screen {
  enter(): void {
    console.log("[WaitingScreen] enter");

    // 오브젝트 숨기기
    getBallMesh().setEnabled(false);
    getPaddle1Mesh().setEnabled(false);
    getPaddle2Mesh().setEnabled(false);

    // GUI 재세팅
    setupWaitingGUI(getScene());
    setWaitingMessage("Waiting for opponent...");
  }

  exit(): void {
    disposeWaitingGUI();
  }

  update(_delta: number): void {}
  render(): void {}
}
