import * as UserTypes from "@/types/user";

export async function fetchAvatar(): Promise<UserTypes.AvatarResponse> {
	const res = await fetch("/api/user/mypage/avatar");

	if(!res.ok) {
		try {
			const error: UserTypes.ApiError = await res.json();
			throw new Error(error.error_msg || "프로필 이미지 오류");
		} catch {
		throw new Error("프로필 이미지 오류");
		}
	}

	const data: UserTypes.AvatarResponse = await res.json();
	return data;
}