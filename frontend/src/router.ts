import { renderPlayPage } from "./pages/playpage.ts";
import { renderMyPage } from "./pages/mypage.ts";
import { renderSignInPage } from "./pages/signinpage.ts";
import { render1P1PlayPage, cleanup1P1PlayPage } from "./pages/1p1_playpage.ts";
import { fetchUsername } from "@/api";
import { renderTPPlayPage, cleanupTPPlayPage } from "./pages/tp_playpage.ts";

let previousCleanup: (() => void) | null = null;

export async function render() {
	const app = document.getElementById("app");
	if (!app) return;

	if (previousCleanup) {
		previousCleanup();
		previousCleanup = null;
	}

	const hashPath = location.hash.replace("#/", "").split("/");
	const mainRoute = hashPath[0];
	const subRoute = hashPath[1];

	// ✅ 로그인 체크가 필요한 페이지 목록
	const protectedRoutes = ["mypage", "play"];
	// ✅ 로그인이 안 되어 있는데 보호된 페이지 요청 시 -> signin으로 이동
	if (protectedRoutes.includes(mainRoute) && !(await fetchUsername())) {
		location.hash = "#/signin";
		return;
	}

	if (mainRoute === "play") {
		if (subRoute === "1p1") {
			app.innerHTML = render1P1PlayPage();
			previousCleanup = cleanup1P1PlayPage;
		} else if (subRoute === "tp") {
			app.innerHTML = renderTPPlayPage();
			previousCleanup = cleanupTPPlayPage;
		} else {
			app.innerHTML = renderPlayPage();
		}
	} else if (mainRoute === "mypage") {
		app.innerHTML = await renderMyPage();
	} else if (mainRoute === "signin" || mainRoute === "") {
		app.innerHTML = await renderSignInPage();
	} else {
		app.innerHTML = "<h1>404 - 페이지를 찾을 수 없음</h1>";
	}
}

window.addEventListener("hashchange", async () => {
	await render();
});