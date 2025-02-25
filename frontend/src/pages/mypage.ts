// import { getState } from "../state.ts";

export async function renderMyPage() {
	try{
		const response = await fetch("http://localhost:4000/user");
		if(!response.ok) {
			throw new Error("사용자 데이터를 불러오지 못했습니다.");
		}
		const user = await response.json();

		const template = `
		<h1>👤 My Page</h1>
		<img src="${user.profileImg}" alt="프로필 사진">
		<p>${user.username}</p>
	  `;

	  return template;
	} catch (error){
		console.error("에러발생: ", error);
		return "<h1>❌ 사용자 정보를 불러올 수 없습니다.</h1>";
	}
}