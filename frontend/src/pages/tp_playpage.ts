import { initCanvas, resetCanvas } from "../scripts/core/canvasManager";
import { socketManager } from "../scripts/network/websocketManager";
import { setupKeyListeners } from "../scripts/input/keyManager";
import { fetchUsername } from "@/api";

export function renderTPPlayPage() {
    const template = `
	<div class="bg-black h-full text-gray-200 flex flex-col justify-center items-center">
			<canvas id="ping-ping" width="800" height="600"></canvas>
		</div>
	`;

    queueMicrotask(async () => {
        const nickname = await fetchUsername();

        const canvas = document.getElementById("ping-ping") as HTMLCanvasElement;
        if (!canvas) {
            console.error("canvas not found");
            return;
        }

        initCanvas(); // 엔진 + 오브젝트 + GUI + 루프
        socketManager.connect("tournament", nickname.username);  // WebSocket 연결
        setupKeyListeners();           // 키 입력 처리
    });

    return template;
}

export function cleanupTPPlayPage(): void {
    socketManager.disconnect(); // WebSocket 종료
    resetCanvas();              // 엔진 & 상태 정리
}
