// screenManager.ts
import { Screen } from "./Screen";
import { WaitingScreen } from "./WaitingScreen";
import { CountingScreen } from "./CountingScreen";
import { PlayScreen } from "./PlayScreen";
// import { DisconnectedScreen } from "./DisconnectedScreen";
// import { GameOverScreen } from "./GameOverScreen"; // 향후 확장 가능

import { WebSocketMessage } from "../types";

let currentScreen: Screen | null = null;

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
      changeScreen(new CountingScreen(data.countdown ?? 5));
      break;

    case "round_start":
      changeScreen(new PlayScreen());
      break;

    // case "opponent_exit":
    //   changeScreen(new DisconnectedScreen(data.opponent_username ?? "opponent"));
    //   break;

    // 향후 확장:
    // case "game_end":
    //   changeScreen(new GameOverScreen(data.final_winner ?? "???"));
    //   break;
  }
}
