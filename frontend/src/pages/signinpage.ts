export function renderSignInPage() {
  const template = `
	<div>
	<button onclick="window.location.href='/api/auth/login/42'">42 로그인</button>
	<button onclick="window.location.href='/api/auth/login/github'">GitHub 로그인</button>
	<button onclick="window.location.href='/api/auth/logout'">로그아웃</button>

	<div id="username-element"></div>
	<img id="avatar-element" />
	</div>
  `;

  return template;
}
