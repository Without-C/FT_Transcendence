// import { initCanvas, resetCanvas } from "../scripts/canvas/canvasManager";
// import { socketManager } from "../scripts/websocketManager";
// import { setupKeyListeners } from "../scripts/keyManager";

// export function render1P1PlayPage(): string {
//   const template = `
//     <div>
//       <canvas id="ping-ping" width="800" height="600"></canvas>
//     </div>
//   `;

//   queueMicrotask(() => {
//     const canvas = document.getElementById("ping-ping") as HTMLCanvasElement;
//     if (!canvas) {
//       console.error("canvas not found");
//       return;
//     }

//     initCanvas(); // 엔진 + 오브젝트 + GUI + 루프
//     socketManager.connect("duel");  // WebSocket 연결
//     setupKeyListeners();           // 키 입력 처리
//   });

//   return template;
// }

// export function cleanup1P1PlayPage(): void {
//   socketManager.disconnect(); // WebSocket 종료
//   resetCanvas();              // 엔진 & 상태 정리
// }
