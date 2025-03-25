import { Screen } from "./Screen";
import { getBallMesh, getPaddle1Mesh, getPaddle2Mesh } from "../canvas/gameObjects";
import { getScene } from "../canvas/engineCore";
import {
  setupScoreboardGUI,
  setUsernames,
  updateScoreboard,
  updateRoundWins,
  disposeScoreboardGUI
} from "../canvas/guiScoreboard";
import { getGameState } from "../canvas/stateManager";

let prevScore = { player1: -1, player2: -1 };
let prevWins = { player1: -1, player2: -1 };

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
      updateRoundWins(state.wins?.player1 ?? 0, state.wins?.player2 ?? 0);

      prevScore = { ...state.score };
      prevWins = { ...state.wins };
    }
  }

  update(_delta: number): void {
    const state = getGameState();
    if (!state) return;

    const { player1: score1, player2: score2 } = state.score;
    const { player1: win1 = 0, player2: win2 = 0 } = state.wins ?? {};

    if (score1 !== prevScore.player1 || score2 !== prevScore.player2) {
      updateScoreboard(score1, score2);
      prevScore = { player1: score1, player2: score2 };
    }

    if (win1 !== prevWins.player1 || win2 !== prevWins.player2) {
      updateRoundWins(win1, win2);
      prevWins = { player1: win1, player2: win2 };
    }
  }

  exit(): void {
    prevScore = { player1: -1, player2: -1 };
    prevWins = { player1: -1, player2: -1 };
    disposeScoreboardGUI(); // GUI 제거
  }

  render(): void {}
}
