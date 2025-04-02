import { Screen } from "./Screen";
import { getScene } from "../core/engineCore";
import { setupWaitingGUI, setWaitingMessage, disposeWaitingGUI } from "./gui/guiWaiting";
import { hideGameObjects } from "../game/gameObjects";

export class WaitingScreen extends Screen {
  enter(): void {
    console.log("[WaitingScreen] enter");

    hideGameObjects();

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
