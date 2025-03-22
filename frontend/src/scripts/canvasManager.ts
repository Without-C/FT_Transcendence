// 🔹 캔버스 및 컨텍스트 가져오기
const canvas = document.getElementById("ping-ping") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// 🔹 캔버스 메시지 설정
export function setCanvasMessage(message: string, background: string): void {
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 60px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

// 🔹 카운트다운 표시
export function setCountdown(countdown: number, player1: string, player2: string): void {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 60px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
  ctx.fillText(`${player1} vs ${player2}`, canvas.width / 2, canvas.height / 4);
}

// 🔹 토너먼트 카운트다운 표시
export function setCountdownTournament(
  countdown: number,
  player1: string,
  player2: string,
  players: string[],
  currentRound: number
): void {
  function drawLine(fromX: number, fromY: number, toX: number, toY: number): void {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  function highlightLine(currentRound: number): void {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    switch (currentRound) {
      case 0:
        drawLine(150, 200, 250, 200);
        drawLine(150, 200, 150, 250);
        drawLine(250, 200, 250, 250);
        break;
      case 1:
        drawLine(350, 200, 450, 200);
        drawLine(350, 200, 350, 250);
        drawLine(450, 200, 450, 250);
        break;
      case 2:
        drawLine(200, 150, 400, 150);
        drawLine(200, 150, 200, 200);
        drawLine(400, 150, 400, 200);
        break;
    }
  }

  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  drawLine(200, 150, 400, 150);

  drawLine(200, 150, 200, 200);
  drawLine(400, 150, 400, 200);

  drawLine(150, 200, 250, 200);
  drawLine(350, 200, 450, 200);

  drawLine(150, 200, 150, 250);
  drawLine(250, 200, 250, 250);
  drawLine(350, 200, 350, 250);
  drawLine(450, 200, 450, 250);

  // 어느 경기가 진행중인지 표시
  highlightLine(currentRound);

  ctx.font = "bold 20px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 5);

  for (let i = 0; i < 4; i++) {
    ctx.fillText(players[i], 150 + i * 100, 270);
  }

  if (currentRound === 2) {
    ctx.fillText(player1, 200, 220);
    ctx.fillText(player2, 400, 220);
  }
}

// 🔹 공 그리기
export function drawBall(ballX: number, ballY: number): void {
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const ballRadius = 10;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

// 🔹 패들 그리기
export function drawPaddle(width: number, height: number, x: number, y: number): void {
  ctx.fillStyle = "white";
  ctx.fillRect(x - width / 2, y - height / 2, width, height);
}

// 🔹 점수 표시
export function drawScore(player1Score: number, player2Score: number): void {
  ctx.font = "bold 40px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.fillText(player1Score.toString(), canvas.width * (2 / 5), 50);
  ctx.fillText(":", canvas.width / 2, 50);
  ctx.fillText(player2Score.toString(), canvas.width * (3 / 5), 50);
}

// 🔹 라운드 승리자 표시
export function drawWinner(winner: string, player1Score: number, player2Score: number): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 60px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(winner, canvas.width / 2, canvas.height / 2);
  ctx.fillText(player1Score.toString(), canvas.width * (1 / 5), 200);
  ctx.fillText(player2Score.toString(), canvas.width * (4 / 5), 200);
}

// 🔹 최종 승리자 표시
export function drawFinalWinner(finalWinner: string): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 100px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(finalWinner, canvas.width / 2, canvas.height / 2);
}

// 🔹 플레이어 이름 표시
export function drawUsername(username1: string, username2: string): void {
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(username1, canvas.width / 5, canvas.height / 8);
  ctx.fillText(username2, (canvas.width / 5) * 4, canvas.height / 8);
}
