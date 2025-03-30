import { socketManager } from "../network/websocketManager";

export function setupKeyListeners(): void {
  const keyState: Record<string, boolean> = {};

  document.addEventListener("keydown", (event) => {
    if (!keyState[event.key]) {
      keyState[event.key] = true;
      socketManager.sendKeyState(event.key, "press");
    }
  });

  document.addEventListener("keyup", (event) => {
    keyState[event.key] = false;
    socketManager.sendKeyState(event.key, "release");
  });

  window.addEventListener("blur", () => {
    for (const key in keyState) {
      if (keyState[key]) {
        keyState[key] = false;
        socketManager.sendKeyState(key, "release");
      }
    }
  });
}
