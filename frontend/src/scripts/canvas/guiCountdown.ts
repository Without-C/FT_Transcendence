// guiCountdown.ts
import * as GUI from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";

let guiTexture: GUI.AdvancedDynamicTexture;
let countdownTextBlock: GUI.TextBlock | null = null;

export function setupCountdownGUI(scene: Scene): void {
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

export function setCountdownText(value: string): void {
  if (countdownTextBlock) {
    countdownTextBlock.text = value;
  }
}

export function clearCountdownText(): void {
  if (countdownTextBlock) {
    countdownTextBlock.text = "";
  }
}

export function disposeCountdownGUI(): void {
  countdownTextBlock?.dispose();
  countdownTextBlock = null;
  guiTexture?.dispose();
}
