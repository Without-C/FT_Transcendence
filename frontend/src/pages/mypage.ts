import { getState } from "../state.ts";

export function renderMyPage() {
  const { username, profileImg } = getState();

  const template = `
    <h1>👤 My Page</h1>
    <img src="${profileImg}" alt="프로필 사진">
    <p>${username}</p>
  `;

// ✅ 사용자 데이터를 위한 타입 정의
type User = {
    id: number;
    name: string;
    username: string;
    email: string;
};

// ✅ API에서 데이터를 가져오는 함수 (비동기 함수 사용)
async function fetchUsers(): Promise<User[]> {
    try {
        // ✅ `fetch`를 사용하여 API 요청을 보냄
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        // ✅ `response.ok`가 `false`라면, 네트워크 오류를 발생시킴
        if (!response.ok) {
            throw new Error("네트워크 오류 발생");
        }

        // ✅ 응답 데이터를 JSON으로 변환하고 `User[]` 타입으로 지정
        const users: User[] = await response.json();
        return users; // ✅ 성공적으로 데이터를 받아오면 반환
    } catch (error) {
        console.error("데이터 가져오기 실패:", error);
        return []; // ✅ 오류 발생 시 빈 배열 반환
    }
}

// ✅ 함수 실행 후 데이터를 콘솔에 출력
fetchUsers().then(users => {
    console.log("사용자 목록:", users);
});

  return template;
}