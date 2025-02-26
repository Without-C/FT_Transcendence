import { getState } from "../state.ts";

export function renderMyPage() {
  const { username, profileImg } = getState();

  const template = `
    <h1>👤 My Page</h1>
    <img src="${profileImg}" alt="프로필 사진">
    <p>${username}</p>
  `;

  return template;
}