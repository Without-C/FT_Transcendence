// guiManager.ts
import { Scene } from "@babylonjs/core";
import { setupWaitingGUI, disposeWaitingGUI } from "./guiWaiting";
import { setupCountdownGUI, disposeCountdownGUI } from "./guiCountdown";
// import { setupScoreboardGUI, disposeScoreboardGUI } from "./guiScoreboard";

// 현재 설정된 화면 상태 저장
let currentScreen: "waiting" | "countdown" | "play" | null = null;

// 📦 GUI 초기화 (스크린 전환 시 호출)
export function setupGUIFor(screen: "waiting" | "countdown" | "play", scene: Scene) {
  if (currentScreen === screen) return; // 이미 설정된 상태면 무시

  clearGUI(); // 기존 GUI 제거
  currentScreen = screen;

  switch (screen) {
    case "waiting":
      setupWaitingGUI(scene);
      break;
    case "countdown":
      setupCountdownGUI(scene);
      break;
    // case "play":
    //   setupScoreboardGUI(scene);
    //   break;
  }
}

// 🧼 모든 GUI 정리 (다음 GUI 진입 전에 호출)
export function clearGUI(): void {
  disposeWaitingGUI();
  disposeCountdownGUI();
//   disposeScoreboardGUI();
  currentScreen = null;
}