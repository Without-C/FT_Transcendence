const keyState = {};

document.addEventListener('keydown', function (event) {
	if (!keyState[event.key]) {
		keyState[event.key] = true;
		// console.log(event.key, "pressed");
		sendKeyState(event.key, "press");
	}
});

document.addEventListener('keyup', function (event) {
	keyState[event.key] = false;
	// console.log(event.key, "released");
	sendKeyState(event.key, "release");
});

// 플레이어가 키를 누르고 있는 상태에서 다른 창으로 포커스를 옮겼을 때 모든 키 release
window.addEventListener('blur', function () {
	for (const key in keyState) {
		if (keyState[key]) {
			keyState[key] = false;
			sendKeyState(key, "release");
		}
	}
});