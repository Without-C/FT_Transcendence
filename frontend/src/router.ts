import {renderPlayPage} from "./pages/playpage.ts";
import {renderMyPage} from "./pages/mypage.ts";
import {renderSignInPage} from "./pages/signinpage.ts";

export function render() {
	const app = document.getElementById("app");
	if(!app) return;

	const hashPath = location.hash.replace("#/", "");

	if(hashPath === "play") {
		app.innerHTML = renderPlayPage();
	} else if(hashPath === "mypage") {
		app.innerHTML = renderMyPage();
	} else if(hashPath === "signin") {
		app.innerHTML = renderSignInPage();	
	} else {
		app.innerHTML = "<h1>404 - 페이지를 찾을 수 없음</h1>";
	}
}

window.addEventListener("hashchange", () => {
	render();
});
window.addEventListener("DOMContentLoaded", () => {
	render();
});