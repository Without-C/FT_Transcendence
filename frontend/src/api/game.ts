import * as GameTypes from "@/types/game";
import { handleApiError } from "@/utils/handleApiError";

/**
 * 1vs1 게임 기록 가져오기
 * @returns SingleGameResponse (배열 또는 빈 객체)
 */
export async function fetchSingleGames(): Promise<GameTypes.SingleGameResponse> {
	const res = await fetch("api/game/history?playmode=single");

	if(!res.ok) {
		await handleApiError(res, "1vs1 게임 기록 조회 실패");
	}

	const data: GameTypes.SingleGameResponse = await res.json();
	return data;
}

/**
 * 토너먼트 게임 기록 가져오기
 * @returns TournamentGameResponse (배열 또는 빈 객체)
 */
export async function fetchTournamentGames(): Promise<GameTypes.TournamentGameResponse> {
	const res = await fetch("api/game/history?playmode=tournament");

	if(!res.ok) {
		await handleApiError(res, "토너먼트 게임 기록 조회 실패");
	}

	const data: GameTypes.TournamentGameResponse = await res.json();
	return data;
}