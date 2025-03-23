// export function renderTPPlayPage() {
//     const template = `
// 		<div>
// 			<canvas id="ping-ping" width="600" height="400"></canvas>
// 		</div>
// 	`;

//     setTimeout(() => {
//         loadCanvasScripts();
//     }, 0);

//     return template;
// }

// function loadCanvasScripts() {
//     const scripts = [
//         "./src/scripts/canvasManager.js",
//         "./src/scripts/tp_websocketManager.js",
//         "./src/scripts/keyManager.js"
//     ];

//     scripts.forEach(src => {
//         const script = document.createElement("script");
//         script.src = src;
//         script.defer = true;
//         document.body.appendChild(script);
//     });
// }