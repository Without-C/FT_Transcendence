// stateManager.ts
import { GameState } from "./types";

let currentGameState: GameState | null = null;
let isGameStarted: boolean = false;
let pendingGameState: GameState | null = null;

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

export function setPendingGameState(state: GameState): void {
  pendingGameState = state;
}

export function getPendingGameState(): GameState | null {
  return pendingGameState;
}

export function clearPendingGameState(): void {
  pendingGameState = null;
}