import { Screen } from "./Screen";
import { getScene } from "../core/engineCore";
import {
  setupMessageGUI,
  setCanvasMessage,
  disposeMessageGUI
} from "./gui/guiMessage"; // GUI 모듈에서 메시지 전용 관리

export class OpponentExitScreen extends Screen {
  private opponentName: string;

  constructor(opponentName: string) {
    super();
    this.opponentName = opponentName;
  }

  enter(): void {
    console.log("[OpponentExitScreen] enter");

    // 모든 오브젝트 비활성화

    // 메시지 GUI 세팅
    setupMessageGUI(getScene());
    setCanvasMessage(`${this.opponentName} has left the match.`);
  }

  exit(): void {
    disposeMessageGUI();
  }

  update(_delta: number): void {}
  render(): void {}
}
