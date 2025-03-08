const canvas = document.getElementById('ping-ping');
const ctx = canvas.getContext('2d');

function setCanvasMessage(message, background) {
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.font = "bold 60px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function setCountdown(countdown, player1_username, player2_username) {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.font = "bold 60px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
	ctx.fillText(player1_username + " vs " + player2_username, canvas.width / 2, canvas.height / 4);
}

// TODO: 대진표 보여주면서 양쪽에 누구인지 닉네임도 띄워주기
// TODO: 1, 2경기가 마무리 되면 다름에 대진표 보여줄 때 이긴 사람도 출력해주기
function setCountdownTournament(countdown, player1_username, player2_username, players, currentRound) {
	function drawLine(fromX, fromY, toX, toY) {
		ctx.beginPath();
		ctx.moveTo(fromX, fromY);
		ctx.lineTo(toX, toY);
		ctx.stroke();
	}

	function highlightLine(currentRound) {
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

	ctx.font = "bold 40px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillText(countdown, canvas.width / 2, canvas.height / 5);

	for (let i = 0; i < 4; i++) {
		ctx.fillText(players[i], 150 + i * 100, 300);
	}
}

function draw_ball(ball_x, ball_y, background) {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const ballRadius = 10;
	ctx.beginPath();
	ctx.arc(ball_x, ball_y, ballRadius, 0, Math.PI * 2, false);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function draw_paddle(width, height, x, y) {
	ctx.fillStyle = "white";
	ctx.fillRect(x - width / 2, y - height / 2, width, height);
}

function draw_score(player1_score, player2_score) {
	ctx.font = "bold 40px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";

	ctx.fillText(player1_score, canvas.width * (2 / 5), 50);
	ctx.fillText(":", canvas.width / 2, 50);
	ctx.fillText(player2_score, canvas.width * (3 / 5), 50);
}

function draw_winner(winner, player1_round_score, player2_round_score) {
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.font = "bold 60px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillText(winner, canvas.width / 2, canvas.height / 2);

	ctx.fillText(player1_round_score, canvas.width * (1 / 5), 200);
	ctx.fillText(player2_round_score, canvas.width * (4 / 5), 200);
}

function draw_final_winner(final_winner) {
	ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.font = "bold 100px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillText(final_winner, canvas.width / 2, canvas.height / 2);
}

function draw_username(username1, username2) {
	ctx.font = "bold 30px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillText(username1, canvas.width / 5, canvas.height / 8);
	ctx.fillText(username2, canvas.width / 5 * 4, canvas.height / 8);
}