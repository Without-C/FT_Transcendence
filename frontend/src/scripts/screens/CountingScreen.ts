import { Screen } from "./Screen";
import {
  setupCountdownGUI,
  setCountdownText,
  clearCountdownText,
  disposeCountdownGUI
} from "../canvas/guiCountdown";
import { getScene } from "../canvas/engineCore";
import { getBallMesh, getPaddle1Mesh, getPaddle2Mesh } from "../canvas/gameObjects";
import { changeScreen } from "./screenManager";
import { PlayScreen } from "./PlayScreen";

export class CountingScreen extends Screen {
  private countdown: number;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private isComplete = false;

  constructor(initialCount: number = 5) {
    super();
    this.countdown = initialCount;
  }

  enter(): void {
    // 오브젝트 숨기기
    getBallMesh().setEnabled(false);
    getPaddle1Mesh().setEnabled(false);
    getPaddle2Mesh().setEnabled(false);

    // GUI 초기화
    setupCountdownGUI(getScene());
    setCountdownText(this.countdown.toString());

    this.timerId = setInterval(() => {
      this.countdown--;

      if (this.countdown > 0) {
        setCountdownText(this.countdown.toString());
      } else {
        setCountdownText("START!");
        this.isComplete = true;
        this.clearTimer();

        setTimeout(() => {
          clearCountdownText();
          disposeCountdownGUI();
          changeScreen(new PlayScreen());
        }, 1000);
      }
    }, 1000);
  }

  exit(): void {
    this.clearTimer();
    disposeCountdownGUI();
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  update(_delta: number): void {}

  render(): void {}
}
