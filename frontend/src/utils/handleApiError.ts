import { ApiError } from "@/types/user";

/**
 * 공통 API 에러 핸들러
 * @param res fetch 요청 결과 Response 객체
 * @param defaultMessage 에러 메시지
 */
export async function handleApiError(res: Response, defaultMsg = "요청 실패"): Promise<never> {
    try {
        const error: ApiError = await res.json();
        throw new Error(error.error_msg || defaultMsg);
    } catch {
        throw new Error(defaultMsg);
    }
}