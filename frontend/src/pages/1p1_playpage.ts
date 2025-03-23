import { initCanvas, setCanvasMessage } from "../scripts/canvasManager";
import { socketManager } from "../scripts/websocketManager";
import { setupKeyListeners } from "../scripts/keyManager";

export function render1P1PlayPage(): string {
	const template = `
	  <div>
		<canvas id="ping-ping" width="600" height="400"></canvas>
	  </div>
	`;
  
	setTimeout(() => {
	  // ✅ DOM 렌더 완료 후 실행
	  initCanvas();
	  setCanvasMessage("Waiting...", "black");
	  // ✅ 1v1 전용 웹소켓 연결
	  socketManager.connect("duel");  
	  // ✅ 키 리스너 등록
	  setupKeyListeners();
	}, 0);
  
	return template;
}

export function cleanup1P1PlayPage(): void {
	socketManager.disconnect(); // WebSocket 종료
}