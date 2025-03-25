// screenManager.ts
import { Screen } from "./Screen";
import { WaitingScreen } from "./WaitingScreen";
import { CountingScreen } from "./CountingScreen";
import { PlayScreen } from "./PlayScreen";
import { OpponentExitScreen } from "./OpponentExitScreen";
import { GameOverScreen } from "./GameOverScreen";

import { WebSocketMessage } from "../types";

let currentScreen: Screen | null = null;
let usernames = { player1: "", player2: "" };
let initialScore = { player1: 0, player2: 0 };

export function setPlayerInfo(name1: string, name2: string): void {
  usernames.player1 = name1;
  usernames.player2 = name2;
}

export function setInitialScore(score1: number, score2: number): void {
  initialScore.player1 = score1;
  initialScore.player2 = score2;
}

export function getPlayerInfo() {
  return usernames;
}

export function getInitialScore() {
  return initialScore;
}

export function changeScreen(newScreen: Screen): void {
  if (
    currentScreen &&
    currentScreen.constructor === newScreen.constructor
  ) {
    console.log("[ScreenManager] Already in this screen.");
    return;
  }

  console.log(
    `[ScreenManager] Switching from ${currentScreen?.constructor.name ?? "None"} to ${newScreen.constructor.name}`
  );

  currentScreen?.exit();
  currentScreen = newScreen;
  currentScreen.enter();
}

export function updateCurrentScreen(delta: number): void {
  currentScreen?.update(delta);
}

export function renderCurrentScreen(): void {
  currentScreen?.render();
}

// 🎯 WebSocket 이벤트 기반 화면 전환 처리
export function handleGameEvent(type: string, data: WebSocketMessage): void {
  switch (type) {
    case "wait":
      changeScreen(new WaitingScreen());
      break;

    case "countdown":
      if (data.countdown && data.player1_username && data.player2_username) {
        setPlayerInfo(data.player1_username, data.player2_username);
        setInitialScore(0, 0); // 초기화 or 서버 값
        changeScreen(new CountingScreen());
      }
      break;

    case "round_start":
      changeScreen(new PlayScreen());
      break;

      case "opponent_exit":
        changeScreen(new OpponentExitScreen(data.opponent_username ?? "Opponent"));
        break;

        case "game_end":
          if (data.final_winner) {
            changeScreen(new GameOverScreen(data.final_winner));
          }
          break;
  }
}
