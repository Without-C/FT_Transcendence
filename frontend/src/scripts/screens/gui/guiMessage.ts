// canvas/guiMessage.ts
import * as GUI from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";

let guiTexture: GUI.AdvancedDynamicTexture;
let messageBlock: GUI.TextBlock;

export function setupMessageGUI(scene: Scene): void {
  guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("MessageUI", true, scene);

  messageBlock = new GUI.TextBlock();
  messageBlock.text = "";
  messageBlock.color = "white";
  messageBlock.fontSize = 48;
  messageBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  messageBlock.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

  guiTexture.addControl(messageBlock);
}

export function setCanvasMessage(msg: string): void {
  if (messageBlock) messageBlock.text = msg;
}

export function disposeMessageGUI(): void {
  guiTexture?.dispose();
}
