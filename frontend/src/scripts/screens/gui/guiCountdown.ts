import * as GUI from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";

let guiTexture: GUI.AdvancedDynamicTexture | null = null;
let countdownTextBlock: GUI.TextBlock | null = null;

export function setupCountdownGUI(scene: Scene): void {
  // 기존 GUI 제거
  if (guiTexture) {
    guiTexture.dispose();
  }

  guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("countdownUI", true, scene);

  countdownTextBlock = new GUI.TextBlock("countdownText", "");
  countdownTextBlock.color = "white";
  countdownTextBlock.fontSize = 96;
  countdownTextBlock.outlineColor = "black";
  countdownTextBlock.outlineWidth = 4;
  countdownTextBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  countdownTextBlock.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

  guiTexture.addControl(countdownTextBlock);
}

export function setCountdownText(text: string): void {
  if (countdownTextBlock) {
    countdownTextBlock.text = text;
  }
}

export function clearCountdownGUI(): void {
  guiTexture?.dispose();
  guiTexture = null;
  countdownTextBlock = null;
}
