function getCookie(name) {
	const cookieName = name + "=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookieArr = decodedCookie.split(';');
	for (let i = 0; i < cookieArr.length; i++) {
		let cookie = cookieArr[i].trim();
		if (cookie.indexOf(cookieName) === 0) {
			return cookie.substring(cookieName.length, cookie.length);
		}
	}
	return null;
}

const username = getCookie("username");
const username_element = document.getElementById("username-element");
if (username) {
	username_element.textContent = username;
}

const avatar_url = getCookie("avatar_url");
const avatar_element = document.getElementById("avatar-element");
if (avatar_url) {
	avatar_element.src = "/api/user/avatars/" + avatar_url;
	console.log(avatar_element.src);
}