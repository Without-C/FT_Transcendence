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

function setCountdownTournament(countdown, player1_username, player2_username, players, currentRound) {
	console.log(players);
	console.log(currentRound);
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.font = "bold 60px Arial";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
	ctx.fillText(player1_username + " vs " + player2_username, canvas.width / 2, canvas.height / 4);
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