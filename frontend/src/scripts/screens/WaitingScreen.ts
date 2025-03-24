import { Screen } from "./Screen";
import { getBallMesh, getPaddle1Mesh, getPaddle2Mesh } from "../canvas/gameObjects";
import { setCanvasMessage, setMessageAlignment, HAlign, VAlign } from "../canvas/guiManager";

export class WaitingScreen extends Screen {
	enter(): void {
		getBallMesh().setEnabled(false);
		getPaddle1Mesh().setEnabled(false);
		getPaddle2Mesh().setEnabled(false);

		// ✅ 메시지 표시
		setMessageAlignment(HAlign.CENTER, VAlign.CENTER);
		setCanvasMessage("Waiting...");
	}

	exit(): void {
		// 👁️ 오브젝트는 다음 화면에서 켜면 되므로 여기선 메시지만 지워도 충분
		setCanvasMessage("");
	}

	update(_delta: number): void {
		// Nothing to do
	}

	render(): void {
		// Nothing to do
	}
}