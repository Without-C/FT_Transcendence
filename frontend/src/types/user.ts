// 프로필 이미지
export type AvatarResponse = {
	avatar_url: string;
}

// 유저 네임
export type UsernameResponse = {
	username: string;
};

// 팔로잉 목록
export type FollowingUser  = {
	username: string;
	online: 0 | 1;
};

export type FollowingResponse = FollowingUser[] | {};

// 팔로워 목록 -> number로 받아오기로 하지 않았나
// export type FollowResponse = {
// 	following_username: string;
// };

export type FollowResponse = {
	following_number: number;
};

// 유저 검색 목록 받아오기
export type SearchResultUser  = {
	username: string;
	online: 0 | 1;
	following: 0 | 1;
};

export type SearchResponse = SearchResultUser[] | {};

// 에러
export type ApiError = {
	error_code: number;
	error_msg: string;
}