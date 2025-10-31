import * as UserTypes from "@/types/user";
import { handleApiError } from "@/utils/handleApiError";

/**
 * 프로필 이미지(avatar_url) 가져오기
 * @returns avatar_url(string)이 담긴 객체
 */
export async function fetchAvatar(): Promise<UserTypes.AvatarResponse> {
	console.log("fetchAvatar 호출 시작");
	const res = await fetch("api/user/mypage/avatar", {
		credentials: 'include'
	});
	console.log("fetchAvatar 응답:", res.status, res.statusText);

	if(!res.ok) { //400
		await handleApiError(res, "프로필 이미지 가져오기 실패");
	}

	console.log("이미지 가져오기 성공")
	const data: UserTypes.AvatarResponse = await res.json();
	return data;
}

/**
 * 유저 이름(username) 가져오기
 * @returns username(string)이 담긴 객체
 */
export async function fetchUsername(): Promise<UserTypes.UsernameResponse> {
	console.log("fetchUsername 호출 시작");
	const res = await fetch("api/user/mypage/username", {
		credentials: 'include'
	});
	console.log("fetchUsername 응답:", res.status, res.statusText);

	if(!res.ok) {
		await handleApiError(res, "유저 이름 가져오기 실패");
	}
	const data: UserTypes.UsernameResponse = await res.json();
	// console.log(await res.json());
	console.log("fetchUsername 성공:", data);
	return data;
}

/**
 * 프로필 이미지 변경하기 -> string이여도 괜찮나, FormData??
 */
export async function updateAvatar(file: File): Promise<void> {
	const formData = new FormData();
	formData.append("avatar", file); // 서버에서 "avatar" 필드로 받도록 설정

	const res = await fetch("api/user/mypage/avatar", {
		method: "PATCH",
		credentials: "include",
		body: formData, // ⛔ Content-Type 헤더는 생략해야 함 (브라우저가 자동 처리함)
	});

	if (!res.ok) {
		await handleApiError(res, "프로필 이미지 변경 실패");
	}
}

/**
 * 유저 이름 변경하기
 * @param newUsername 새로 설정할 유저 이름
 */
export async function updateUsername(newUsername: string): Promise<void> {
	const res = await fetch("api/user/mypage/username", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: 'include',
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
	console.log("fetchFollowing 호출 시작");
	const res = await fetch("api/user/mypage/following", {
		credentials: 'include'
	});
	console.log("fetchFollowing 응답:", res.status, res.statusText);

	if(!res.ok) {
		await handleApiError(res, "팔로잉 목록 가져오기 실패");
	}

	console.log("팔로잉 가져오기 성공");
	const data: UserTypes.FollowingResponse = await res.json();
	console.log("fetchFollowing 성공:", data);
	return data;
}
/**
 * 팔로워 명수 가져오기
 * @returns following_number(number)이 담긴 객체
*/
export async function fetchFollow(): Promise<UserTypes.FollowResponse> {
	console.log("fetchFollow 호출 시작");
	const res = await fetch("api/user/mypage/followers", {
		credentials: 'include'
	});
	console.log("fetchFollow 응답:", res.status, res.statusText);

	if(!res.ok) {
		await handleApiError(res, "팔로워 명수 가져오기 실패");
	}
	
	console.log("팔로워 가져오기 성공");
	const data: UserTypes.FollowResponse = await res.json();
	console.log("fetchFollow 성공:", data);

	return data;
}

/**
 * 특정 사용자 팔로우하기
 * @param username 팔로우할 유저 이름
 */
export async function followUser(username: string): Promise<void> {
	const res = await fetch("api/user/mypage/follow", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: 'include',
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
	const res = await fetch("api/user/mypage/unfollow", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: 'include',
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
	const res = await fetch(`api/user/mypage/search?searching_user=${query}`, {
		credentials: 'include'
	});

	if(!res.ok) {
		await handleApiError(res, "유저 검색 실패");
	}

	const data: UserTypes.SearchResponse = await res.json();
	return data;
}