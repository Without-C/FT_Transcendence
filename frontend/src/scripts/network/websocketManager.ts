import { setGameState } from "../core/stateManager";
import { WebSocketMessage, KeyState } from "../core/types";
import { handleGameEvent } from "../screens/screenManager";

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
    // 1️⃣ 상태 전환을 ScreenManager에 위임
    handleGameEvent(data.type, data);

    // 2️⃣ 실시간 게임 상태 업데이트
    if (data.type === "game_state" && data.game_state && this.gameIsPlaying) {
      setGameState(data.game_state);
    }

    // 3️⃣ 라운드 결과 로그
    if (data.type === "round_end" && data.winner && data.round_score) {
      console.log(
        `🏁 Round End - Winner: ${data.winner}, Score: ${data.round_score.player1} : ${data.round_score.player2}`
      );
      // TODO: setRoundResult() GUI 출력
    }

    // 4️⃣ 최종 승자 로그
    if (data.type === "game_end" && data.final_winner) {
      console.log(`🏆 Final Winner: ${data.final_winner}`);
      // TODO: setFinalWinner() GUI 출력
    }

    // 5️⃣ 게임 시작/종료 상태
    if (data.type === "round_start") {
      this.gameIsPlaying = true;
    } else if (data.type === "opponent_exit") {
      this.gameIsPlaying = false;
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