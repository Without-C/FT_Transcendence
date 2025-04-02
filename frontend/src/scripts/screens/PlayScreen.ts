import { Screen } from "./Screen";
import { showGameObjects, updateGameObjects } from "../game/gameObjects";
import { getScene } from "../core/engineCore";
import {
  setupScoreboardGUI,
  setUsernames,
  updateScoreboard,
  updateRoundWins,
  disposeScoreboardGUI
} from "./gui/guiScoreboard";
import {
  getPendingGameState,
  clearPendingGameState
} from "../core/stateManager";

let prevScore = { player1: -1, player2: -1 };
let prevWins = { player1: -1, player2: -1 };

export class PlayScreen extends Screen {
  enter(): void {
    console.log("[PlayScreen] enter");

    // 🎮 게임 오브젝트 표시
    showGameObjects();

    // 🖥️ GUI 초기화
    setupScoreboardGUI(getScene());

    // 🔰 상태 초기화
    const state = getPendingGameState();
    if (!state) {
      console.warn("[PlayScreen] 초기 게임 상태가 존재하지 않습니다.");
      return;
    }

    setUsernames(state.username.player1, state.username.player2);
    updateScoreboard(state.score.player1, state.score.player2);
    updateRoundWins(state.wins?.player1 ?? 0, state.wins?.player2 ?? 0);

    prevScore = { ...state.score };
    prevWins = { ...state.wins };
  }

  update(_delta: number): void {
    const state = getPendingGameState();
    if (!state) return;

    updateGameObjects(state);

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
    console.log("[PlayScreen] exit");

    prevScore = { player1: -1, player2: -1 };
    prevWins = { player1: -1, player2: -1 };

    disposeScoreboardGUI();
    clearPendingGameState(); // 🔁 상태 초기화
  }

  render(): void {}
}
