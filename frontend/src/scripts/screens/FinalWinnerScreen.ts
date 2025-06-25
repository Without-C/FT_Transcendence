import { Screen } from "./Screen";
import { getScene } from "../core/engineCore";
import * as GUI from "@babylonjs/gui";

export class FinalWinnerScreen extends Screen {
  private guiTexture: GUI.AdvancedDynamicTexture | null = null;

  constructor(private winner: string) {
    super();
  }

  enter(): void {
    this.guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("finalWinnerUI", true, getScene());

    const text = new GUI.TextBlock();
    text.text = `🏆 ${this.winner}\nFinal Winner!`;
    text.color = "gold";
    text.fontSize = 78;
    text.outlineColor = "black";
    text.outlineWidth = 6;
    text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    text.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    this.guiTexture.addControl(text);
  }

  exit(): void {
    this.guiTexture?.dispose();
    this.guiTexture = null;
  }

  update(_delta: number): void {}
  render(): void {}
}
