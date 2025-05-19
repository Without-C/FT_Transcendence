import * as GUI from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";

// 내부 상태
let guiTexture: GUI.AdvancedDynamicTexture | null = null;
let scoreText: GUI.TextBlock | null = null;

// 🎯 GUI 생성 - "Hello World" 텍스트만 표시
export function setupScoreboardGUI(scene: Scene): void {
  guiTexture?.dispose();
  guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("scoreboardUI", true, scene);

  scoreText = new GUI.TextBlock();
  scoreText.text = "0 : 0";
  scoreText.color = "white";
  scoreText.fontSize = 56;
  scoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  scoreText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  scoreText.top = "20px";

  guiTexture.addControl(scoreText);
}

export function setUsernames(_name1: string, _name2: string): void {}

export function updateScoreboard(score1: number, score2: number): void {
  if (scoreText) {
    scoreText.text = `${score1} : ${score2}`;
  }
}

export function updateRoundWins(_p1Wins: number, _p2Wins: number): void {}

export function disposeScoreboardGUI(): void {
  guiTexture?.dispose();
  guiTexture = null;
}
