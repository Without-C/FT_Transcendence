// stateManager.ts
import { GameState } from "./types";

let currentGameState: GameState | null = null;
let isGameStarted: boolean = false;

export function setGameState(state: GameState): void {
  currentGameState = state;
  isGameStarted = true;
}

export function getGameState(): GameState | null {
  return currentGameState;
}

export function hasGameStarted(): boolean {
  return isGameStarted;
}

export function resetGameState(): void {
  currentGameState = null;
  isGameStarted = false;
}