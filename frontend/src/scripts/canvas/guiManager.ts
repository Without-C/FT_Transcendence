import * as GUI from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";

let guiTexture: GUI.AdvancedDynamicTexture;
let messageTextBlock: GUI.TextBlock;
let countdownTextBlock: GUI.TextBlock;

// 정렬 enum export
export const HAlign = {
	LEFT: GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
	CENTER: GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
	RIGHT: GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
  };
  
  export const VAlign = {
	TOP: GUI.Control.VERTICAL_ALIGNMENT_TOP,
	CENTER: GUI.Control.VERTICAL_ALIGNMENT_CENTER,
	BOTTOM: GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
  };
  

export function setupGUI(scene: Scene): void {
	guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

	messageTextBlock = new GUI.TextBlock();
	messageTextBlock.color = "white";
	messageTextBlock.fontSize = 36;
	messageTextBlock.outlineColor = "black";
	messageTextBlock.outlineWidth = 2;
	messageTextBlock.text = "";
	messageTextBlock.textHorizontalAlignment = HAlign.CENTER;
	messageTextBlock.textVerticalAlignment = VAlign.CENTER;
	messageTextBlock.top = "0px";
	guiTexture.addControl(messageTextBlock);

	countdownTextBlock = new GUI.TextBlock();
	countdownTextBlock.color = "white";
	countdownTextBlock.fontSize = 96;
	countdownTextBlock.outlineColor = "black";
	countdownTextBlock.outlineWidth = 4;
	countdownTextBlock.text = "";
	countdownTextBlock.textHorizontalAlignment = HAlign.CENTER;
	countdownTextBlock.textVerticalAlignment = VAlign.CENTER;
	guiTexture.addControl(countdownTextBlock);
}

export function setCanvasMessage(message: string): void {
	if (messageTextBlock) {
		messageTextBlock.text = message;
	}
}

export function setMessageAlignment(
	horizontal: number = HAlign.CENTER,
	vertical: number = VAlign.CENTER
): void {
	if (!messageTextBlock) return;
	messageTextBlock.textHorizontalAlignment = horizontal;
	messageTextBlock.textVerticalAlignment = vertical;
}

export function setCountdown(countdown: number): void {
	if (!countdownTextBlock) return;

	if (countdown > 0) {
		countdownTextBlock.text = countdown.toString();
	} else {
		countdownTextBlock.text = "START!";
		setTimeout(() => {
			countdownTextBlock.text = "";
		}, 1000);
	}
}
