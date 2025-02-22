export function renderPlayPage() {
	const template = `
		<div>
			<canvas id="ping-ping" width="600" height="400"></canvas>
		</div>
	`;

	// const scripts = [
	// 	"./src/scripts/canvasManager.js",
	// 	"./src/scripts/websocketManager.js",
	// 	"./src/scripts/keyManager.js"
	// ];

	// scripts.forEach(src => {
	// 	const script = document.createElement("script");
	// 	script.src = src;
	// 	script.defer = true;
	// 	document.body.appendChild(script);
	// });
  
	return template;
  }