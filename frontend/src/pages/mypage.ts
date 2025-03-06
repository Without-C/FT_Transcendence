
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
		<div class="flex flex-col items-center lg:flex-row lg:items-start lg:justify-center lg:gap-10 p-6 min-h-screen bg-black text-white">

		<section class="flex flex-col items-center gap-4 pt-20">
		  <div class="relative">
			<img src="${user.profileImg}" 
				class="w-40 h-40 rounded-full" alt="profile">
			<button class="absolute bottom-2 right-2 bg-[#375433] px-2.5 py-1 rounded-full">✎</button>
		  </div>
		  <div class="flex flex-row gap-5">
			<h2 class="text-3xl font-bold text-[#9CCA95]">${user.username}</h2>
			<button class="text-xl text-[#9CCA95] rounded-full">✎</button>
		  </div>
		</section>
	  
		<section class="flex flex-col w-full max-w-3xl">
	  
		  <div class="flex justify-end gap-4 text-[#9CCA95]">
			<span><strong>131</strong> followers</span>
			<span><strong>120</strong> following</span>
		  </div>
	  
		  <div class="relative p-5 m-3 border-3 border-[#375433] w-full">
			<h3 class="absolute top-0 left-0 bg-[#375433] text-lg font-bold px-3 rounded-br-lg">📋 FRIENDS LIST</h3>
			<div class="flex justify-center items-center border-b-2 border-[#375433] pb-4 ">
			  <div class="flex items-center bg-[#162113] px-2 rounded">
				<input type="text" placeholder="SEARCH" class="text-white outline-none">
				<span>🔍</span>
			  </div>
			</div>
			<ul id="friendList" class="space-y-3 pt-4"></ul>
		  </div>
	  
		  <div class="relative p-5 m-3 border-3 border-[#375433] w-full">
			<div class="absolute top-0 left-0 flex justify-center items-center gap-4 pb-2">
				<h3 class="bg-[#375433] text-lg font-bold px-3 rounded-br-lg">⭐ MATCH HISTORY</h3>
				<button id="single">1P1</button>
				<button id="tournament">TP</button>
			</div>
			<ul id="gameList" class="space-y-3 pt-10"></ul>
		  </div>
		`;
		
		setTimeout(() => {
			const friendListElement = document.getElementById("friendList");
			const gameListElement = document.getElementById("gameList");
			const singleButton = document.querySelector("#single");
			const tournamentButton = document.querySelector("#tournament");

			// friendList 랜더링
			const renderFriendList = () => {
				friendListElement.innerHTML = "";
				user.following.forEach((friend, idx) => {
					const friendList = document.createElement("li");
					friendList.className = "flex justify-between items-center px-5 py-2 bg-[#162113]";

					const index = document.createElement("span");
					index.textContent = `#${idx + 1}`;
					friendList?.appendChild(index);

					const name = document.createElement("span");
					name.textContent = `${friend.username}`
					friendList?.appendChild(name);

					const online = document.createElement("span");
					online.textContent = `${friend.online}`
					friendList?.appendChild(online);
	
					const unfollowBtn = document.createElement("button");
					unfollowBtn.className = "border-1 border-[#9CCA95] text-[#9CCA95] px-7 py-1 rounded-2xl";
					unfollowBtn.textContent = "Unfollow"
					friendList?.appendChild(unfollowBtn);
					unfollowBtn.addEventListener("click", async () => {
						const response = await fetch(`http://localhost:4000/user/following/${friend.username}`,{
							method: "DELETE"					
						});
						if(response.ok) {
							console.log(`${friend.username} 삭제완료`);
							window.location.reload();
						} else {
							console.error(`친구 삭제 실패`); 
						}
					});
					friendList.appendChild(unfollowBtn);
	
					document.getElementById("friendList")?.appendChild(friendList);
				});
			}

			//  1P1 리스트 렌더링
			const renderSingleList = () => {
				gameListElement.innerHTML = "";
				singleButton.className = "bg-[#375433] border-2 border-[#375433] px-4 rounded-xl";
				tournamentButton.className = "bg-black border-2 border-[#375433] px-4 rounded-xl";
				game.history.single.forEach((single, idx) => {
					const singlePlayList = document.createElement("li");
					singlePlayList.className = "flex justify-between items-center px-5 py-2 bg-[#162113]";

					const index = document.createElement("span");
					index.textContent = `#${idx + 1}`;
					singlePlayList.appendChild(index);
					
					index.textContent = `#${idx + 1}`;
					singlePlayList.appendChild(index);

					const result = document.createElement("span");
					if((single.player1.username === user.username && single.player1.result === "winner") ||
						(single.player2.username === user.username && single.player2.result === "winner")) {
							result.className = "text-blue-400 font-bold";
							result.textContent = "WIN";
					}
					else {
						result.className = "text-red-400 font-bold";
						result.textContent = "LOSE";
					}
					singlePlayList.appendChild(result);

					const date = document.createElement("span");
					date.textContent = `${single.date}`;
					singlePlayList.appendChild(date);

					const players = document.createElement("span");
					players.textContent = `${single.player1.username} vs ${single.player2.username}`;
					singlePlayList.appendChild(players);

					const score = document.createElement("span");
					score.classList.add("font-bold");
					score.textContent = `${single.player1.round_score} : ${single.player2.round_score}`;
					singlePlayList.appendChild(score);

					gameListElement?.appendChild(singlePlayList);
				});
			};

			// TP 리스트 렌더링
			const renderTournamentList = () => {
				gameListElement.innerHTML = "";
				singleButton.className = "bg-black border-2 border-[#375433] px-4 rounded-xl";
				tournamentButton.className = "bg-[#375433] border-2 border-[#375433] px-4 rounded-xl";
				game.history.tournament.forEach((tournament, idx) => {
					const tournamentPlayList = document.createElement("li");
					tournamentPlayList.className = "flex justify-between items-center px-5 py-2 bg-[#162113]";

					const index = document.createElement("span");
					index.textContent = `#${idx + 1}`;
					tournamentPlayList.appendChild(index);

					const result = document.createElement("span");
					if((tournament.game[2].player1.username === user.username && tournament.game[2].player1.result === "winner") ||
						(tournament.game[2].player2.username === user.username && tournament.game[2].player2.result === "winner")) {
							result.className = "text-blue-400 font-bold";
							result.textContent = "WIN";
					}
					else {
						result.className = "text-red-400 font-bold";
						result.textContent = "LOSE";
					}
					tournamentPlayList.appendChild(result);

					const date = document.createElement("span");
					date.textContent = `${tournament.date}`;
					tournamentPlayList.appendChild(date);

					const players = document.createElement("div");
					players.className = "flex flex-col";

					const results = document.createElement("div");
					results.className = "flex flex-col";

					tournament.game.forEach(round => {
						const player = document.createElement("span");
						const result = document.createElement("span");
						result.classList.add("font-bold");

						player.textContent = `${round.player1.username} vs ${round.player2.username}`;
						result.textContent = `${round.player1.round_score} : ${round.player2.round_score}`;

						players?.appendChild(player);
						results?.appendChild(result);
					});
					tournamentPlayList.appendChild(players);
					tournamentPlayList.appendChild(results);

					gameListElement?.appendChild(tournamentPlayList);
				});
			};

			singleButton?.addEventListener("click", renderSingleList);
			tournamentButton?.addEventListener("click", renderTournamentList);
			
			renderFriendList();
			renderSingleList();
		});
		
		return template;
	} catch (error){
		console.error("에러발생: ", error);
		return "<h1>❌ 사용자 정보를 불러올 수 없습니다.</h1>";
	}
}
// json-server --watch frontend/my-server/db.json --port 4000