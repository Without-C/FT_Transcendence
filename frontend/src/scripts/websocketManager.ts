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

// 🔹 전역 변수: 현재 게임 상태 여부
let gameIsPlaying: boolean = false;
let chatSocket: WebSocket;
 
// 🔹 메시지 구조 정의
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

// 🔹 WebSocket 생성 함수
export function initWebSocket(): void {
  chatSocket = new WebSocket(`ws://${window.location.host}/api/ping-pong/duel/ws`);

  chatSocket.onmessage = (event: MessageEvent) => {
    const data: WebSocketMessage = JSON.parse(event.data);

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
        gameIsPlaying = true;
        break;
      case "opponent_exit":
        gameIsPlaying = false;
        if (data.opponent_username) {
          setCanvasMessage(`${data.opponent_username} exited!`, "gray");
        }
        break;
      case "game_state":
        if (!gameIsPlaying || !data.game_state) break;
        const { ball, paddle1, paddle2, score, username } = data.game_state;
        drawBall(ball.x, ball.y);
        drawPaddle(paddle1.width, paddle1.height, paddle1.x, paddle1.y);
        drawPaddle(paddle2.width, paddle2.height, paddle2.x, paddle2.y);
        drawScore(score.player1, score.player2);
        drawUsername(username.player1, username.player2);
        break;
      case "round_end":
        gameIsPlaying = false;
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
  };

  chatSocket.onclose = () => {
    console.error("WebSocket closed unexpectedly");
  };
}

// 🔹 키 입력 상태를 서버로 전송
export function sendKeyState(key: string, state: "press" | "release"): void {
  if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
    chatSocket.send(JSON.stringify({ action: "key", key, state }));
  }
}
