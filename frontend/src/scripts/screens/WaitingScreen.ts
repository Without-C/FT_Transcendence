import { Screen } from "./Screen";
import { getScene } from "../core/engineCore";
import { setupWaitingGUI, setWaitingMessage, disposeWaitingGUI } from "./gui/guiWaiting";
import { getBallMesh, getPaddle1Mesh, getPaddle2Mesh } from "../game/gameObjects";

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
