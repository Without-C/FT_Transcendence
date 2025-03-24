import { Screen } from "./Screen";
import { WaitingScreen } from "./WaitingScreen";
// import { CountingScreen } from "./CountingScreen";
// import { PlayScreen } from "./PlayScreen";
// import { DisconnectedScreen } from "./DisconnectedScreen";
import { WebSocketMessage } from "../types";

let currentScreen: Screen | null = null;

export function changeScreen(newScreen: Screen): void {
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

export function handleGameEvent(type: string, _data: WebSocketMessage): void {
  switch (type) {
    case "wait":
      changeScreen(new WaitingScreen());
      break;

    // case "countdown":
    //   changeScreen(new CountingScreen(data.countdown ?? 3)); // 전달된 countdown 사용
    //   break;

    // case "round_start":
    //   changeScreen(new PlayScreen());
    //   break;

    // case "opponent_exit":
    //   changeScreen(new DisconnectedScreen(data.opponent_username ?? "opponent"));
    //   break;

    // 게임 종료 화면은 아직 없지만 여기에 추가 가능
    // case "game_end":
    //   changeScreen(new GameOverScreen(data.final_winner ?? "???"));
    //   break;
  }
}