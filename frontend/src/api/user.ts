import * as UserTypes from "@/types/user";

// 프로필 이미지 가져오기
export async function fetchAvatar(): Promise<UserTypes.AvatarResponse> {
	const res = await fetch("/api/user/mypage/avatar");

	if(!res.ok) { //400
		try {
			const error: UserTypes.ApiError = await res.json();
			throw new Error(error.error_msg || "프로필 이미지 가져오기 실패");
		} catch {
			throw new Error("프로필 이미지 가져오기 실패");
		}
	}

	const data: UserTypes.AvatarResponse = await res.json();
	return data;
}

// 유저 이름 가져오기
export async function fetchUsername(): Promise<UserTypes.UsernameResponse> {
	const res = await fetch("/api/user/mypage/username");

	if(!res.ok) {
		try {
			const error: UserTypes.ApiError = await res.json();
			throw new Error(error.error_msg || "유저 이름 가져오기 실패");
		} catch {
			throw new Error("유저 이름 가져오기 실패");
		}
	}

	const data: UserTypes.UsernameResponse = await res.json();
	return data;
}

// 프로필 이미지 변경하기 -> string이여도 괜찮나, FormData??
export async function updateAvatar(newAvatarUrl: string): Promise<void> {
	const res = await fetch("/api/user/mypage/avatar", {
		method: "PATCH",
		headers: {
			"Content-Types": "application/json",
		},
		body: JSON.stringify({avatar_url: newAvatarUrl}),
	});

	if (!res.ok) {
		try {
			const error: UserTypes.ApiError = await res.json();
			throw new Error(error.error_msg || "프로필 이미지 변경 실패");
		} catch {
			throw new Error("프로필 이미지 변경 실패");
		}
	}
}

// 유저 이름 변경하기
export async function updateUsername(newUsername: string): Promise<void> {
	const res = await fetch("/api/user/mypage/username", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({username: newUsername}),
	});

	if (!res.ok) {
		try {
			const error: UserTypes.ApiError = await res.json();
			throw new Error(error.error_msg || "유저 이름 변경 실패");
		} catch {
			throw new Error("유저 이름 변경 실패");
		}
	}
}

