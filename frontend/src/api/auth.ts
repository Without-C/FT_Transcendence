import { handleApiError } from "@/utils/handleApiError";

/**
 * 42 로그인 페이지로 리다이렉트
 */
export function redirectTo42Login(): void {
	window.location.href = "api/auth/login/42";
}

/**
 * Google 로그인 페이지로 리다이렉트
 */
export function redirectToGoogleLogin(): void {
	window.location.href = "api/auth/login/google";
}

/**
 * Github 로그인 페이지로 리다이렉트
 */
// export function redirectToGithubLogin(): void {
// 	window.location.href = "api/auth/login/github";
// }

/**
 * 로그아웃 요청 (JWT 쿠키 삭제)
 */
export async function logout(): Promise<void> {
	const res = await fetch("api/auth/logout", {
		method: "DELETE",
		credentials: "include",
	});

	if(!res.ok) {
		await handleApiError(res, "로그아웃 실패");
	}
}