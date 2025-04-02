import { Screen } from "./Screen";
import { getScene } from "../core/engineCore";
import {
  setupCountdownGUI,
  setCountdownText,
  clearCountdownGUI,
} from "./gui/guiCountdown";
import { changeScreen } from "./screenManager";
import { PlayScreen } from "./PlayScreen";
import { hideGameObjects } from "../game/gameObjects";
import { getGameState, setPendingGameState } from "../core/stateManager";

export class CountingScreen extends Screen {
  private countdown = 3;
  private timerId: ReturnType<typeof setInterval> | null = null;

  enter(): void {
    console.log("[CountingScreen] enter");

    // 🎮 게임 오브젝트 숨김
    hideGameObjects();

    // 🧠 상태 저장
    const state = getGameState();
    if (state) {
      setPendingGameState(state);
    } else {
      console.warn("[CountingScreen] 저장할 게임 상태가 없습니다.");
    }

    // 🖥️ GUI 세팅
    setupCountdownGUI(getScene());
    setCountdownText(this.countdown.toString());

    // ⏱️ 물리 시간 기반 카운트다운
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
