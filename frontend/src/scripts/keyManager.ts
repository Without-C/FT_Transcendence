import { sendKeyState } from "./websocketManager";

const keyState: Record<string, boolean> = {};

export function setupKeyListeners(): void {
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (!keyState[event.key]) {
      keyState[event.key] = true;
      sendKeyState(event.key, "press");
    }
  });

  document.addEventListener("keyup", (event: KeyboardEvent) => {
    keyState[event.key] = false;
    sendKeyState(event.key, "release");
  });

  window.addEventListener("blur", () => {
    for (const key in keyState) {
      if (keyState[key]) {
        keyState[key] = false;
        sendKeyState(key, "release");
      }
    }
  });
}