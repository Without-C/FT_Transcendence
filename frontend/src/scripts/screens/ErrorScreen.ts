import { Screen } from "./Screen";
import { getScene } from "../core/engineCore";
import {
    setupMessageGUI,
    setCanvasMessage,
    disposeMessageGUI
} from "./gui/guiMessage";

export class ErrorScreen extends Screen {
    private message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }

    enter(): void {
        console.log("[ErrorScreen] enter");

        setupMessageGUI(getScene());
        setCanvasMessage(`${this.message}`);
    }

    exit(): void {
        disposeMessageGUI();
    }

    update(_delta: number): void { }
    render(): void { }
}
