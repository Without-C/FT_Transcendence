let gameIsPlaying = false;

const chatSocket = new WebSocket(
	'ws://'
	+ window.location.host
	+ '/api/ping-pong/tournament/ws'
);

chatSocket.onmessage = function (e) {
	const data = JSON.parse(e.data);

	switch (data.type) {
		case "wait":
			setCanvasMessage("Waiting...", "black");
			break;
		case "countdown":
			setCountdownTournament(
				data.countdown,
				data.player1_username,
				data.player2_username,
				data.tournament.players,
				data.tournament.currentRound
			);
			break;
		case "round_start":
			gameIsPlaying = true;
			break;
		case "opponent_exit":
			gameIsPlaying = false;
			setCanvasMessage(data.opponent_username + " exited!", "gray");
			break;
		case "game_state":
			if (!gameIsPlaying) {
				break;
			}
			let ball = data.game_state.ball;
			let paddle1 = data.game_state.paddle1;
			let paddle2 = data.game_state.paddle2;
			let score = data.game_state.score;
			let username1 = data.game_state.username.player1;
			let username2 = data.game_state.username.player2;
			draw_ball(ball.x, ball.y);
			draw_paddle(paddle1.width, paddle1.height, paddle1.x, paddle1.y);
			draw_paddle(paddle2.width, paddle2.height, paddle2.x, paddle2.y);
			draw_score(score.player1, score.player2)
			draw_username(username1, username2);
			break;
		case "round_end":
			gameIsPlaying = false;
			draw_winner(data.winner, data.round_score.player1, data.round_score.player2);
			break;
		case "game_end":
			draw_final_winner(data.final_winner);
			break;
	}
};

chatSocket.onclose = function (e) {
	console.error('Chat socket closed unexpectedly');
};

function sendKeyState(key, state) {
	chatSocket.send(JSON.stringify({ action: "key", key: key, state: state }));
}