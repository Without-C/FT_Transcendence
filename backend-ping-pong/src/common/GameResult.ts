export type GameResult = {
    game_end_reason: string,
    player1: {
        id: string,
        round_score: number,
        result: string,
    },
    player2: {
        id: string,
        round_score: number,
        result: string,
    },
}
