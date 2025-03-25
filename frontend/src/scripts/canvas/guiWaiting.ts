// guiWaiting.ts
import * as GUI from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";

let guiTexture: GUI.AdvancedDynamicTexture;
let waitingText: GUI.TextBlock | null = null;

export function setupWaitingGUI(scene: Scene): void {
  if (guiTexture) {
    guiTexture.dispose();
  }
  guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("waitingUI", true, scene);

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
  if (waitingText) {
    waitingText.text = text;
  }
}

export function disposeWaitingGUI(): void {
  if (waitingText) {
    waitingText.dispose();
    waitingText = null;
  }
  if (guiTexture) {
    guiTexture.dispose();
  }
}
