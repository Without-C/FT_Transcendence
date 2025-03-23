type KeyState = "press" | "release";

interface GameState {
  ball: { x: number; y: number };
  paddle1: { width: number; height: number; x: number; y: number };
  paddle2: { width: number; height: number; x: number; y: number };
  score: { player1: number; player2: number };
  username: { player1: string; player2: string };
}

interface WebSocketMessage {
  type: string;
  countdown?: number;
  player1_username?: string;
  player2_username?: string;
  opponent_username?: string;
  game_state?: GameState;
  winner?: string;
  round_score?: { player1: number; player2: number };
  final_winner?: string;
}

import {
  setCanvasMessage,
  setCountdown,
  drawBall,
  drawPaddle,
  drawScore,
  drawUsername,
  drawWinner,
  drawFinalWinner,
} from "../scripts/canvasManager";

class SocketManager {
  private static instance: SocketManager;
  private socket!: WebSocket;
  private isConnected = false;
  private gameIsPlaying = false;
  private mode: "duel" | "tournament" | "spectator" = "duel";

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public connect(mode: "duel" | "tournament" | "spectator" = "duel"): void {
    if (this.isConnected && this.socket.readyState <= 1) {
      console.log("✅ WebSocket already connected.");
      return;
    }

    this.mode = mode;
    const wsUrl = `ws://${window.location.host}/api/ping-pong/${mode}/ws`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log(`✅ WebSocket connected [${mode} mode]`);
      this.isConnected = true;
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = () => {
      console.warn("⚠️ WebSocket closed.");
      this.isConnected = false;
    };

    this.socket.onerror = (e) => {
      console.error("❌ WebSocket error:", e);
    };
  }

  private handleMessage(data: WebSocketMessage): void {
    switch (data.type) {
      case "wait":
        setCanvasMessage("Waiting...", "black");
        break;
      case "countdown":
        if (data.countdown !== undefined && data.player1_username && data.player2_username) {
          setCountdown(data.countdown, data.player1_username, data.player2_username);
        }
        break;
      case "round_start":
        this.gameIsPlaying = true;
        break;
      case "opponent_exit":
        this.gameIsPlaying = false;
        if (data.opponent_username) {
          setCanvasMessage(`${data.opponent_username} exited!`, "gray");
        }
        break;
      case "game_state":
        if (!this.gameIsPlaying || !data.game_state) break;
        const { ball, paddle1, paddle2, score, username } = data.game_state;
        drawBall(ball.x, ball.y);
        drawPaddle(paddle1.width, paddle1.height, paddle1.x, paddle1.y);
        drawPaddle(paddle2.width, paddle2.height, paddle2.x, paddle2.y);
        drawScore(score.player1, score.player2);
        drawUsername(username.player1, username.player2);
        break;
      case "round_end":
        this.gameIsPlaying = false;
        if (data.winner && data.round_score) {
          drawWinner(data.winner, data.round_score.player1, data.round_score.player2);
        }
        break;
      case "game_end":
        if (data.final_winner) {
          drawFinalWinner(data.final_winner);
        }
        break;
    }
  }

  public disconnect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      this.isConnected = false;
      console.log("🔌 WebSocket manually disconnected.");
    }
  }
  

  public sendKeyState(key: string, state: KeyState): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ action: "key", key, state }));
    } else {
      console.warn("❌ Cannot send key state, socket not open.");
    }
  }

  public getCurrentMode(): "duel" | "tournament" | "spectator" {
    return this.mode;
  }
}

export const socketManager = SocketManager.getInstance();
