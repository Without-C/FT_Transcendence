// 플레이어 공통 정보
export type GamePlayer = {
	username: string;
	roundScore: number;
	result: "winner" | "loser";
}

// 1vs1 게임 목록
export type SingleGameHistoryItem = {
	game_end_reason: string; //normal이 아니면..?
	player1: GamePlayer;
	player2: GamePlayer;
	date: string;
}

export type SingleGameResponse = SingleGameHistoryItem[] | {};

// 토너먼트 게임 기록
export type GameRound = {
	game_end_reason: string;
	player1: GamePlayer;
	player2: GamePlayer;
}

export type TournamentGameHistoryItem = {
	date: string;
	game: [GameRound, GameRound, GameRound];
}

export type TournamentGameResponse = TournamentGameHistoryItem[] | {};