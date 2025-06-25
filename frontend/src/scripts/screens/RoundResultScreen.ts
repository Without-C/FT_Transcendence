import { Screen } from "./Screen";
import { getScene } from "../core/engineCore";
import * as GUI from "@babylonjs/gui";

export class RoundResultScreen extends Screen {
  private guiTexture: GUI.AdvancedDynamicTexture | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(private winner: string, private score: { player1: number; player2: number }) {
    super();
  }

  enter(): void {
    this.guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("roundResultUI", true, getScene());

    const text = new GUI.TextBlock();
    text.text = `🏁 ${this.winner}\n${this.score.player1} : ${this.score.player2}`;
    text.color = "white";
    text.fontSize = 68;
    text.outlineColor = "black";
    text.outlineWidth = 4;
    text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    text.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    this.guiTexture.addControl(text);

    this.timeoutId = setTimeout(() => {
      this.guiTexture?.dispose();
      this.guiTexture = null;
    }, 1200);
  }

  exit(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.guiTexture?.dispose();
    this.guiTexture = null;
  }

  update(_delta: number): void {}
  render(): void {}
}
