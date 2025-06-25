// src/scripts/types.ts

export type KeyState = "press" | "release";

export interface GameState {
  ball: { x: number; y: number; z: number };
  paddle1: { width: number; height: number; x: number; y: number; z: number };
  paddle2: { width: number; height: number; x: number; y: number; z: number };
  score: { player1: number; player2: number };
  wins: {player1: number; player2: number };
  username: { player1: string; player2: string };
}

export interface WebSocketMessage {
  message?: string;
  type: string;
  countdown?: number;
  player1_username?: string;
  player2_username?: string;
  opponent_username?: string;
  game_state?: GameState;
  winner?: string;
  round_score?: { player1: number; player2: number };
  final_winner?: string;
  players?: string[];
  currentRound?: number;
}
