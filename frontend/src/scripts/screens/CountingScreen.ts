import { Screen } from "./Screen";
import { getScene } from "../canvas/engineCore";
import {
  setupCountdownGUI,
  setCountdownText,
  clearCountdownGUI,
} from "../canvas/guiCountdown";
import { getBallMesh, getPaddle1Mesh, getPaddle2Mesh } from "../canvas/gameObjects";
import { changeScreen } from "./screenManager";
import { PlayScreen } from "./PlayScreen";

export class CountingScreen extends Screen {
  private countdown = 3;
  private timerId: ReturnType<typeof setInterval> | null = null;

  enter(): void {
    console.log("[CountingScreen] enter");

    // 게임 오브젝트 숨기기
    getBallMesh().setEnabled(false);
    getPaddle1Mesh().setEnabled(false);
    getPaddle2Mesh().setEnabled(false);

    // GUI 세팅
    setupCountdownGUI(getScene());
    setCountdownText(this.countdown.toString());

    // 물리 시간 기반 카운트다운
    this.timerId = setInterval(() => {
      this.countdown--;

      if (this.countdown > 0) {
        setCountdownText(this.countdown.toString());
      } else {
        setCountdownText("START!");
        this.clearTimer();

        setTimeout(() => {
          clearCountdownGUI();
          changeScreen(new PlayScreen());
        }, 1000);
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  exit(): void {
    this.clearTimer();
    clearCountdownGUI();
  }

  update(_delta: number): void {}
  render(): void {}
}
