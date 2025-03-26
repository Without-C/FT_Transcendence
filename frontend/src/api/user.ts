import * as UserTypes from "@/types/user";
import { handleApiError } from "@/utils/handleApiError";

/**
 * 프로필 이미지(avatar_url) 가져오기
 * @returns avatar_url(string)이 담긴 객체
 */
export async function fetchAvatar(): Promise<UserTypes.AvatarResponse> {
	const res = await fetch("http://localhost:4000/api/user/mypage/avatar");

	if(!res.ok) { //400
		await handleApiError(res, "프로필 이미지 가져오기 실패");
	}

	const data: UserTypes.AvatarResponse = await res.json();
	return data;
}

/**
 * 유저 이름(username) 가져오기
 * @returns username(string)이 담긴 객체
 */
export async function fetchUsername(): Promise<UserTypes.UsernameResponse> {
	const res = await fetch("http://localhost:4000/api/user/mypage/username");

	if(!res.ok) {
		await handleApiError(res, "유저 이름 가져오기 실패");
	}

	const data: UserTypes.UsernameResponse = await res.json();
	return data;
}

/**
 * 프로필 이미지 변경하기 -> string이여도 괜찮나, FormData??
 * @param newAvatarUrl 새로 변경할 프로필 이미지 URL
 */
export async function updateAvatar(newAvatarUrl: string): Promise<void> {
	const res = await fetch("http://localhost:4000/api/user/mypage/avatar", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({avatar_url: newAvatarUrl}),
	});

	if(!res.ok) {
		await handleApiError(res, "프로필 이미지 변경 실패");
	}
}

/**
 * 유저 이름 변경하기
 * @param newUsername 새로 설정할 유저 이름
 */
export async function updateUsername(newUsername: string): Promise<void> {
	const res = await fetch("http://localhost:4000/api/user/mypage/username", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({username: newUsername}),
	});

	if(!res.ok) {
		await handleApiError(res, "유저 이름 변경 실패");
	}
}

/**
 * 팔로잉 목록 가져오기
 * @returns username과 online 상태가 담긴 유저 배열 or 빈 객체 -> online은 일단 모두 1
 */
export async function fetchFollowing(): Promise<UserTypes.FollowingResponse> {
	const res = await fetch("http://localhost:4000/api/user/mypage/following");

	if(!res.ok) {
		await handleApiError(res, "팔로잉 목록 가져오기 실패");
	}

	const data: UserTypes.FollowingResponse = await res.json();
	return data;
}
/**
 * 팔로워 명수 가져오기
 * @returns following_number(number)이 담긴 객체
 */
export async function fetchFollow(): Promise<UserTypes.FollowResponse> {
	const res = await fetch("http://localhost:4000/api/user/mypage/followers");

	if(!res.ok) {
		await handleApiError(res, "팔로워 명수 가져오기 실패");
	}

	const data: UserTypes.FollowResponse = await res.json();
	return data;
}

/**
 * 특정 사용자 팔로우하기
 * @param username 팔로우할 유저 이름
 */
export async function followUser(username: string): Promise<void> {
	const res = await fetch("http://localhost:4000/api/user/mypage/follow", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ follow_username: username}),
	});

	if(!res.ok) {
		await handleApiError(res, "팔로우 실패");
	}
}

/**
 * 특정 사용자 언팔로우
 * @param username 언팔로우할 유저 이름
 */
export async function unfollowUser(username: string): Promise<void> {
	const res = await fetch("http://localhost:4000/api/user/mypage/unfollow", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ unfollow_username: username}),
	});

	if(!res.ok) {
		await handleApiError(res, "언팔로우 실패");
	}
}

/**
 * 특정 문자로 시작하는 유저 목록 가져오기
 * @param keyword 검색할 유저 이름의 시작 문자열
 * @returns username, online, following 상태가 담긴 유저 배열 or 빈 객체 
 */
export async function searchUsers(keyword: string): Promise<UserTypes.SearchResponse> {
	const query = encodeURIComponent(keyword);
	const res = await fetch(`http://localhost:4000/api/user/mypage/search?searching_user=${query}`);

	if(!res.ok) {
		await handleApiError(res, "유저 검색 실패");
	}

	const data: UserTypes.SearchResponse = await res.json();
	return data;
}