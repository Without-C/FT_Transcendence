import * as GUI from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";

let guiTexture: GUI.AdvancedDynamicTexture | null = null;
let waitingText: GUI.TextBlock | null = null;

export function setupWaitingGUI(scene: Scene): void {
  // 이전 GUI 제거
  if (guiTexture) {
    guiTexture.dispose();
    guiTexture = null;
  }

  // 새 GUI 생성
  guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("waitingUI", true, scene);

  // 텍스트박스 생성
  waitingText = new GUI.TextBlock("waitingText", "Waiting for opponent...");
  waitingText.color = "white";
  waitingText.fontSize = 42;
  waitingText.outlineColor = "black";
  waitingText.outlineWidth = 4;
  waitingText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  waitingText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

  guiTexture.addControl(waitingText);
}

export function setWaitingMessage(text: string): void {
  if (!waitingText) {
    console.warn("⚠️ waitingText is null. Did you forget to call setupWaitingGUI?");
    return;
  }
  waitingText.text = text;
}

export function disposeWaitingGUI(): void {
  guiTexture?.dispose();
  guiTexture = null;
  waitingText = null;
}