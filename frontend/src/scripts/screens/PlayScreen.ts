import { Screen } from "./Screen";
import { getBallMesh, getPaddle1Mesh, getPaddle2Mesh } from "../canvas/gameObjects";
import { getScene } from "../canvas/engineCore";
import {
  setupScoreboardGUI,
  setUsernames,
  updateScoreboard,
  disposeScoreboardGUI
} from "../canvas/guiScoreboard";
import { getGameState } from "../canvas/stateManager";

let prevScore = { player1: -1, player2: -1 };

export class PlayScreen extends Screen {
  enter(): void {
    console.log("[PlayScreen] enter");

    // 🎮 오브젝트 활성화
    getBallMesh().setEnabled(true);
    getPaddle1Mesh().setEnabled(true);
    getPaddle2Mesh().setEnabled(true);

    // 🖼️ 스코어보드 GUI 세팅
    setupScoreboardGUI(getScene());

    // 🔰 상태 초기화
    const state = getGameState();
    if (state) {
      setUsernames(state.username.player1, state.username.player2);
      updateScoreboard(state.score.player1, state.score.player2);
      prevScore = { ...state.score };
    }
  }

  update(_delta: number): void {
    const state = getGameState();
    if (!state) return;

    const { player1, player2 } = state.score;
    if (player1 !== prevScore.player1 || player2 !== prevScore.player2) {
      updateScoreboard(player1, player2);
      prevScore = { player1, player2 };
    }
  }

  exit(): void {
    prevScore = { player1: -1, player2: -1 };
    disposeScoreboardGUI(); // GUI 제거
  }

  render(): void {} // 필요시 구현
}
