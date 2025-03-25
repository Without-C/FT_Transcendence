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

let player1Rounds: GUI.Rectangle[] = [];
let player2Rounds: GUI.Rectangle[] = [];

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

  const roundContainer1 = new GUI.StackPanel("rounds1");
  roundContainer1.isVertical = false;
  roundContainer1.height = "20px";
  roundContainer1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  roundContainer1.top = "2px";
  
  // 네모 3개 생성
  for (let i = 0; i < 3; i++) {
    const box = new GUI.Rectangle();
    box.width = "16px";
    box.height = "16px";
    box.color = "white";
    box.thickness = 1;
    box.background = "transparent"; // 빈 칸
    box.paddingRight = "4px";
    roundContainer1.addControl(box);
    player1Rounds.push(box);
  }
  
  scoreboard.addControl(roundContainer1);

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

  const roundContainer2 = new GUI.StackPanel("rounds1");
  roundContainer2.isVertical = false;
  roundContainer2.height = "20px";
  roundContainer2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  roundContainer2.top = "2px";
  
  // 네모 3개 생성
  for (let i = 0; i < 3; i++) {
    const box = new GUI.Rectangle();
    box.width = "16px";
    box.height = "16px";
    box.color = "white";
    box.thickness = 1;
    box.background = "transparent"; // 빈 칸
    box.paddingRight = "4px";
    roundContainer2.addControl(box);
    
    player2Rounds.push(box);
  }
  
  scoreboard.addControl(roundContainer1);
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

export function updateRoundWins(p1Wins: number, p2Wins: number) {
  for (let i = 0; i < 3; i++) {
    player1Rounds[i].background = i < p1Wins ? "yellow" : "transparent";
    player2Rounds[i].background = i < p2Wins ? "yellow" : "transparent";
  }
}