import { initCanvas, setCanvasMessage } from "../scripts/canvasManager";
import { initWebSocket } from "../scripts/websocketManager";
import { setupKeyListeners } from "../scripts/keyManager";

export function render1P1PlayPage(): string {
	const template = `
	  <div>
		<canvas id="ping-ping" width="600" height="400"></canvas>
	  </div>
	`;

	setTimeout(() => {
	  const canvas = document.getElementById("ping-ping") as HTMLCanvasElement;
	  if (!canvas) return;
	  initCanvas();
	  setCanvasMessage("Waiting...", "black");
	  initWebSocket();
	  setupKeyListeners();
	}, 0);
	return template;
}

// function loadCanvasScripts() {
// 	const scripts = [
// 		"./src/scripts/canvasManager.js",
// 		"./src/scripts/1p1_websocketManager.js",
// 		"./src/scripts/keyManager.js"
// 	];

// 	scripts.forEach(src => {
// 		const script = document.createElement("script");
// 		script.src = src;
// 		script.defer = true;
// 		document.body.appendChild(script);
// 	});
// }