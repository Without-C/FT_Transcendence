import * as GUI from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";

// 내부 상태 저장
let guiTexture: GUI.AdvancedDynamicTexture | null = null;
let player1Text: GUI.TextBlock;
let player2Text: GUI.TextBlock;
let scoreText: GUI.TextBlock;

let username1 = "Player 1";
let username2 = "Player 2";
let prevScore1 = -1;
let prevScore2 = -1;

export function setupScoreboardGUI(scene: Scene): void {
  // 기존 제거
  guiTexture?.dispose();
  guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("scoreboardUI", true, scene);

  const scoreboard = new GUI.Rectangle("scoreboard");
  scoreboard.width = "400px";
  scoreboard.height = "100px";
  scoreboard.cornerRadius = 1;
  scoreboard.color = "white";
  scoreboard.thickness = 2;
  scoreboard.background = "rgba(0, 0, 0, 0.6)";
  scoreboard.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  scoreboard.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  scoreboard.top = "10px";
  guiTexture.addControl(scoreboard);

  player1Text = new GUI.TextBlock("player1Text", username1);
  player1Text.color = "white";
  player1Text.fontSize = 22;
  player1Text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  player1Text.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  scoreboard.addControl(player1Text, 0, 0);

  scoreText = new GUI.TextBlock("scoreText", "0 : 0");
  scoreText.color = "white";
  scoreText.fontSize = 60;
  scoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  scoreText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  scoreboard.addControl(scoreText, 0, 1);

  player2Text = new GUI.TextBlock("player2Text", username2);
  player2Text.color = "white";
  player2Text.fontSize = 22;
  player2Text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  player2Text.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  scoreboard.addControl(player2Text, 0, 2);
}

export function setUsernames(name1: string, name2: string): void {
  username1 = name1;
  username2 = name2;

  if (player1Text) player1Text.text = username1;
  if (player2Text) player2Text.text = username2;
}

export function updateScoreboard(score1: number, score2: number): void {
  if (score1 !== prevScore1 || score2 !== prevScore2) {
    scoreText.text = `${score1} : ${score2}`;
    prevScore1 = score1;
    prevScore2 = score2;
  }
}

export function disposeScoreboardGUI(): void {
  guiTexture?.dispose();
  guiTexture = null;
}
