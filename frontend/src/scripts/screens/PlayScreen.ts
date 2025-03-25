import { Screen } from "./Screen";
import {
  getBallMesh,
  getPaddle1Mesh,
  getPaddle2Mesh
} from "../canvas/gameObjects";
import {
} from "../canvas/guiManager";
import { getGameState } from "../canvas/stateManager";

let prevScore = { player1: -1, player2: -1 };
let initialized = false;

export class PlayScreen extends Screen {
  enter(): void {
    getBallMesh().setEnabled(true);
    getPaddle1Mesh().setEnabled(true);
    getPaddle2Mesh().setEnabled(true);

    // 메시지 정렬 초기화
    initialized = false;
  }

  update(_delta: number): void {
    const state = getGameState();
    if (!state) return;

    // 🧠 초기 이름/점수 설정 (단 한 번만)
    if (!initialized) {
      prevScore = { ...state.score };
      initialized = true;
      return;
    }

    // 🟢 점수 변경 감지 시 갱신
    const { player1, player2 } = state.score;
    if (player1 !== prevScore.player1 || player2 !== prevScore.player2) {
      prevScore = { player1, player2 };
    }
  }

  exit(): void {
    prevScore = { player1: -1, player2: -1 };
    initialized = false;
  }

  render(): void {}
}
