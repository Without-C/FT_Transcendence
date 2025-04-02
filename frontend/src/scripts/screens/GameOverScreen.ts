import { Screen } from "./Screen";
import { getScene } from "../core/engineCore";
import {
  setupMessageGUI,
  setCanvasMessage,
  disposeMessageGUI
} from "./gui/guiMessage";

export class GameOverScreen extends Screen {
  private winner: string;

  constructor(finalWinner: string) {
    super();
    this.winner = finalWinner;
  }

  enter(): void {
    console.log("[GameOverScreen] enter");

    // 게임 오브젝트 비활성화

    // 메시지 GUI 출력
    setupMessageGUI(getScene());
    setCanvasMessage(`🏆 Winner: ${this.winner}`);
  }

  exit(): void {
    disposeMessageGUI();
  }

  update(_delta: number): void {}
  render(): void {}
}
