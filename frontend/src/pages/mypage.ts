
export async function renderMyPage() {
	try{
		const userResponse = await fetch("http://localhost:4000/user");
		if(!userResponse.ok) {
			throw new Error("사용자 데이터를 불러오지 못했습니다.");
		}
		const user = await userResponse.json();

		const gameResponse = await fetch("http://localhost:4000/game");
		if(!gameResponse.ok) {
			throw new Error("게임 데이터를 불러오지 못했습니다.");
		}
		const game = await gameResponse.json();
		
		const template = `
		<div class="flex gap-10 flex-col lg:flex-row m-auto lg:m-0">
		<div>
			<img src="${user.profileImg}" alt="프로필 사진" class="w-48 aspect-square">
			<p class="text-4xl mt-10">${user.username}</p>
		</div>
		<div class="flex gap-10 flex-col">
			<div>
				<ul class="text-3xl mt-10" id="friendList"></ul>
			</div>
			<div>
				<button id="single">1P1</button>
				<button id="tournament">TP</button>
				<ul class="text-3xl mt-10" id="gameList"></ul>
			</div>
		</div>
		`;
		
		setTimeout(() => {
			user.following.forEach(friend => {
				const friendList = document.createElement("li");
				friendList.textContent = friend.username + " / " + (friend.online === 1?"online":"offline");
				document.getElementById("friendList")?.appendChild(friendList);
			});
			const gameListElement = document.getElementById("gameList");
			const singleButton = document.querySelector("#single");
			const tournamentButton = document.querySelector("#tournament");
			singleButton?.addEventListener("click", async() => {
				gameListElement.innerHTML = "";
				game.history.single.forEach(game => {
					const singlePlayList = document.createElement("li");

					const span = document.createElement("span");
					const idx = 1;
					span.textContent = `#${idx++}  ${game.date}  ${game.player1.username}VS${game.player2.username}  ${game.player1.result} : ${game.player2.result}`;
					singlePlayList.appendChild(span);

					const unfollowButton = document.createElement("button");
					unfollowButton.textContent = "Unfollow";
					// unfollowButton.onclick = () => 
				});
			});
			tournamentButton?.addEventListener("click", async() => {
				gameListElement.innerHTML = "";
				game.history.tournament.forEach(game => {
					const tournamentPlayList = document.createElement("li");
					tournamentPlayList.textContent = "# " + game.date;
					gameListElement?.appendChild(tournamentPlayList);
				});
			});
		})
		
		return template;
	} catch (error){
		console.error("에러발생: ", error);
		return "<h1>❌ 사용자 정보를 불러올 수 없습니다.</h1>";
	}
}
// json-server --watch frontend/db.json --port 4000