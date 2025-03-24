import {renderPlayPage} from "./pages/playpage.ts";
import {renderMyPage} from "./pages/mypage.ts";
import {renderSignInPage} from "./pages/signinpage.ts";
import {render1P1PlayPage, cleanup1P1PlayPage} from "./pages/1p1_playpage.ts";
// import {renderTPPlayPage} from "./pages/tp_playpage.ts";

let previousCleanup: (() => void) | null = null;

export async function render() {
	const app = document.getElementById("app");
	if(!app) return;

	if (previousCleanup) {
		previousCleanup();
		previousCleanup = null;
	}

	const hashPath = location.hash.replace("#/", "").split("/");

	const mainRoute = hashPath[0];
	const subRoute = hashPath[1];

	if(mainRoute === "play") {
		if(subRoute === "1p1") {
			app.innerHTML = render1P1PlayPage();
			previousCleanup = cleanup1P1PlayPage;
		// } else if(subRoute === "tp") {
		// 	app.innerHTML = renderTPPlayPage();
		} else {
			app.innerHTML = renderPlayPage();
		}
	} else if(mainRoute === "mypage") {
		app.innerHTML = await renderMyPage();
	} else if(mainRoute === "signin" || mainRoute === "") {
		app.innerHTML = renderSignInPage();	
	} else {
		app.innerHTML = "<h1>404 - 페이지를 찾을 수 없음</h1>";
	}
}

window.addEventListener("hashchange", async () => {
	await render();
});