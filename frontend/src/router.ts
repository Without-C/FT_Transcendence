import {renderPlayPage} from "./pages/playpage.ts";
import {renderMyPage} from "./pages/mypage.ts";
import {renderSignInPage} from "./pages/signinpage.ts";
import {render1P1PlayPage} from "./pages/1p1_playpage.ts";

export function render() {
	const app = document.getElementById("app");
	if(!app) return;

	const hashPath = location.hash.replace("#/", "").split("/");

	const mainRoute = hashPath[0];
	const subRoute = hashPath[1];

	if(mainRoute === "play") {
		if(subRoute === "1p1") {
			app.innerHTML = render1P1PlayPage();
		} else if(subRoute === "mp") {
			// app.innerHTML = renderMPPlayPage();
		} else if(subRoute === "tp") {
			// app.innerHTML = renderTPPlayPage();
		} else {
			app.innerHTML = renderPlayPage();
		}
	} else if(mainRoute === "mypage") {
		app.innerHTML = renderMyPage();
	} else if(mainRoute === "signin") {
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