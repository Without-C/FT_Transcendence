import * as GUI from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";

// 내부 상태
let guiTexture: GUI.AdvancedDynamicTexture | null = null;
let player1Text: GUI.TextBlock;
let player2Text: GUI.TextBlock;
let scoreText: GUI.TextBlock;

let player1Rounds: GUI.Rectangle[] = [];
let player2Rounds: GUI.Rectangle[] = [];

let username1 = "Player 1";
let username2 = "Player 2";
let prevScore1 = -1;
let prevScore2 = -1;

// 🎯 GUI 생성
export function setupScoreboardGUI(scene: Scene): void {
  guiTexture?.dispose();
  guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("scoreboardUI", true, scene);

  const scoreboard = new GUI.Rectangle("scoreboard");
  scoreboard.width = "600px";
  scoreboard.height = "120px";
  scoreboard.cornerRadius = 6;
  scoreboard.color = "white";
  scoreboard.thickness = 2;
  scoreboard.background = "rgba(0, 0, 0, 0.5)";
  scoreboard.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  scoreboard.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  scoreboard.top = "10px";
  guiTexture.addControl(scoreboard);

  const grid = new GUI.Grid();
  grid.addColumnDefinition(1 / 3, true);
  grid.addColumnDefinition(1 / 3, true);
  grid.addColumnDefinition(1 / 3, true);
  grid.addRowDefinition(0.6, true); // 이름 + 점수
  grid.addRowDefinition(0.4, true); // 라운드 승리
  scoreboard.addControl(grid);

  // 👤 Player 1 이름
  player1Text = new GUI.TextBlock("player1Text", username1);
  player1Text.color = "white";
  player1Text.fontSize = 24;
  player1Text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  grid.addControl(player1Text, 0, 0);

  // 🏆 점수
  scoreText = new GUI.TextBlock("scoreText", "0 : 0");
  scoreText.color = "yellow";
  scoreText.fontSize = 40;
  scoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  grid.addControl(scoreText, 0, 1);

  // 👤 Player 2 이름
  player2Text = new GUI.TextBlock("player2Text", username2);
  player2Text.color = "white";
  player2Text.fontSize = 24;
  player2Text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  grid.addControl(player2Text, 0, 2);

  // ◻️ Player 1 라운드 승리 표시
  const roundPanel1 = createRoundPanel(player1Rounds, GUI.Control.HORIZONTAL_ALIGNMENT_CENTER);
  grid.addControl(roundPanel1, 1, 0);

  // ◻️ Player 2 라운드 승리 표시
  const roundPanel2 = createRoundPanel(player2Rounds, GUI.Control.HORIZONTAL_ALIGNMENT_CENTER);
  grid.addControl(roundPanel2, 1, 2);
}

// 🟨 사용자 이름 설정
export function setUsernames(name1: string, name2: string): void {
  username1 = name1;
  username2 = name2;

  if (player1Text) player1Text.text = username1;
  if (player2Text) player2Text.text = username2;
}

// 🟨 점수 업데이트
export function updateScoreboard(score1: number, score2: number): void {
  if (score1 !== prevScore1 || score2 !== prevScore2) {
    if (scoreText) scoreText.text = `${score1} : ${score2}`;
    prevScore1 = score1;
    prevScore2 = score2;
  }
}

// 🟩 라운드 승리 업데이트
export function updateRoundWins(p1Wins: number, p2Wins: number): void {
  for (let i = 0; i < 3; i++) {
    player1Rounds[i].background = i < p1Wins ? "yellow" : "transparent";
    player2Rounds[i].background = i < p2Wins ? "yellow" : "transparent";
  }
}

// ♻️ GUI 제거
export function disposeScoreboardGUI(): void {
  guiTexture?.dispose();
  guiTexture = null;
  player1Rounds = [];
  player2Rounds = [];
}

// 🧱 내부 라운드 패널 생성
function createRoundPanel(targetArray: GUI.Rectangle[], alignment: number): GUI.StackPanel {
  const panel = new GUI.StackPanel();
  panel.isVertical = false;
  panel.height = "30px";
  panel.paddingTop = "4px";
  panel.horizontalAlignment = alignment;

  for (let i = 0; i < 3; i++) {
    const box = new GUI.Rectangle();
    box.width = "18px";
    box.height = "18px";
    box.color = "white";
    box.thickness = 1;
    box.background = "transparent";
    box.marginRight = "5px";
    panel.addControl(box);
    targetArray.push(box);
  }

  return panel;
}
