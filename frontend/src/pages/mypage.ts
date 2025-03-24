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
			<img src="${user.profileImg}" class="w-40 h-40 rounded-full" alt="profile">
			<input type="file" id="fileInput" accept="image/*" class="hidden">
			<button id="profileImg" class="absolute bottom-2 right-2 bg-[#375433] px-2.5 py-1 rounded-full">✎</button>
		  </div>

		  <div id="username" class="flex flex-row gap-5">
			<div id="currentUsername" class="flex flex-row gap-5 hidden">
				<input id="usernameInput" type="text" maxlength="10" class="bg-[#162113] text-3xl font-bold text-[#9CCA95] px-2 w-50 rounded">
				<button id="currentUsernameInput" class="text-xl text-[#9CCA95] rounded-full">✎</button>
			</div>
			<div id="changedUsername" class="flex flex-row gap-5">
				<h2 class="text-[3vw] font-bold text-[#9CCA95]">${user.username}</h2>
				<button id="changedUsernameInput" class="text-xl text-[#9CCA95] rounded-full">✎</button>
			</div>
		  </div>
		</section>
	  
		<section class="flex flex-col w-full max-w-3xl">
		  <div class="flex justify-end gap-4 text-[#9CCA95]">
			<span><strong>131</strong> followers</span>
			<span><strong>120</strong> following</span>
		  </div>
	  
		  <div class="relative p-5 m-3 border-3 border-[#375433] text-[1vw] w-full">
			<h3 class="absolute top-0 left-0 bg-[#375433] text-[1.1vw] font-bold px-3 py-1 rounded-br-lg">📋 FRIENDS LIST</h3>
			<div class="flex justify-center items-center border-b-2 border-[#375433] pb-4">
			  <div class="flex items-center bg-[#162113] px-2 rounded">
				<input id="search" type="text" name="username" placeholder="SEARCH" maxlength="10" class="text-white outline-none">
				<button id="searchOrDelete"></button>
			  </div>
			</div>
			<ul id="friendList" class="space-y-3 pt-4"></ul>
		  </div>
	  
		  <div class="relative p-5 m-3 border-3 border-[#375433] text-[1vw] w-full">
			<div class="absolute top-0 left-0 flex justify-center items-center gap-4 pb-2">
				<h3 class="bg-[#375433] text-[1.1vw] font-bold px-3 py-1 rounded-br-lg">⭐ MATCH HISTORY</h3>
				<div>
					<button id="single">1P1</button>
					<button id="tournament">TP</button>
				</div>
			</div>
			<ul id="gameList" class="space-y-3 pt-10"></ul>
		  </div>
		`;
		
		setTimeout(() => {
			const friendListElement = document.getElementById("friendList");
			const gameListElement = document.getElementById("gameList");
			const singleButton = document.querySelector("#single");
			const tournamentButton = document.querySelector("#tournament");
			const searchElement = document.getElementById("search");
			const profileImgButton = document.getElementById("profileImg");

			// friendList 랜더링
			const renderFriendList = () => {
				friendListElement.innerHTML = "";
				const searchIcon = document.querySelector("#searchOrDelete");
				searchIcon.textContent = "🔍";

				user.following.forEach((friend, idx) => {
					const friendList = document.createElement("li");
					friendList.className = "flex justify-between items-center px-5 py-2 bg-[#162113]";

					const index = document.createElement("span");
					index.textContent = `#${idx + 1}`;
					friendList?.appendChild(index);

					const name = document.createElement("span");
					name.textContent = `${friend.username}`.padEnd(10, " ");
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

					const result = document.createElement("span");
					result.style.whiteSpace = "pre"; 
					if((single.player1.username === user.username && single.player1.result === "winner") ||
						(single.player2.username === user.username && single.player2.result === "winner")) {
							result.textContent = `#${idx + 1}   WIN! `.padEnd(15, " ");
							result.innerHTML = `<span class="text-white">${result.textContent.slice(0, 4)}</span>` +
												`<span class="font-bold text-blue-400">${result.textContent.slice(3)}</span>`;
					}
					else {
						result.textContent = `#${idx + 1}   LOSE`.padEnd(15, " ");
						result.innerHTML = `<span class="text-white">${result.textContent.slice(0, 4)}</span>` +
											`<span class="font-bold text-red-400">${result.textContent.slice(3)}</span>`;
					}
					singlePlayList.appendChild(result);

					const date = document.createElement("span");
					date.textContent = `${single.date}`;
					singlePlayList.appendChild(date);

					const players = document.createElement("span");
					players.style.whiteSpace = "pre"; 
					players.textContent = `${single.player1.username.padStart(10, " ")} vs ${single.player2.username.padEnd(10, " ")}`;
					singlePlayList.appendChild(players);

					const score = document.createElement("span");
					score.style.whiteSpace = "pre"; 
					score.classList.add("font-bold");
					score.textContent = `${single.player1.round_score.toString().padStart(2, " ")} : ${single.player2.round_score.toString().padEnd(2, " ")}`;
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

					const result = document.createElement("span");
					result.style.whiteSpace = "pre";
					if((tournament.game[2].player1.username === user.username && tournament.game[2].player1.result === "winner") ||
						(tournament.game[2].player2.username === user.username && tournament.game[2].player2.result === "winner")) {
							result.textContent = `#${idx + 1}   WIN! `.padEnd(15, " ");
							result.innerHTML = `<span class="text-white">${result.textContent.slice(0, 4)}</span>` +
												`<span class="font-bold text-blue-400">${result.textContent.slice(3)}</span>`;
					}
					else {
						result.textContent = `#${idx + 1}   LOSE`.padEnd(15, " ");
						result.innerHTML = `<span class="text-white">${result.textContent.slice(0, 4)}</span>` +
											`<span class="font-bold text-red-400">${result.textContent.slice(3)}</span>`;
					}
					tournamentPlayList.appendChild(result);

					const date = document.createElement("span");
					date.textContent = `${tournament.date}`;
					tournamentPlayList.appendChild(date);

					const players = document.createElement("div");
					players.className = "flex flex-col";

					const results = document.createElement("div");
					results.className = "flex flex-col";

					tournament.game.forEach((round, idx) => {
						const player = document.createElement("span");
						const result = document.createElement("span");
						player.style.whiteSpace = "pre";
						result.style.whiteSpace = "pre";
						result.classList.add("font-bold");

						player.textContent = `R${idx + 1} :   ${round.player1.username} vs ${round.player2.username}`;
						result.textContent = `${round.player1.round_score.toString().padStart(2, " ")} : ${round.player2.round_score.toString().padEnd(2, " ")}`;

						players?.appendChild(player);
						results?.appendChild(result);
					});
					tournamentPlayList.appendChild(players);
					tournamentPlayList.appendChild(results);

					gameListElement?.appendChild(tournamentPlayList);
				});
			};


			// search 랜더링
			const renderSearch = (search = '') => {
				friendListElement.innerHTML = "";
				const searchIcon = document.querySelector("#searchOrDelete");
				searchIcon?.addEventListener("click", () => {
					searchElement.value = ''; 
					renderFriendList();
				});
				searchIcon.textContent = "❌";
				if(search == '') {
					renderFriendList();
				}
			};

			singleButton?.addEventListener("click", renderSingleList);
			tournamentButton?.addEventListener("click", renderTournamentList);
			searchElement?.addEventListener("input", search => {
				const keyword = (search.target as HTMLInputElement).value;
				renderSearch(keyword);
			});
			profileImgButton?.addEventListener("click", () => {
				document.getElementById("fileInput")?.click();
			})
			
			//username 변경 랜더링
			const currentUsernameInput = document.getElementById("currentUsernameInput");
			const changedUsernameInput = document.getElementById("changedUsernameInput");

			document.getElementById("currentUsernameInput")?.addEventListener("click" , () => {
				const newName = document.getElementById("usernameInput"); //빈문자열인지 확인
				newName.value = '';
				document.getElementById("currentUsername")?.classList.toggle("hidden");
				document.getElementById("changedUsername")?.classList.toggle("hidden");
			});

			document.getElementById("changedUsernameInput")?.addEventListener("click", () => {
				document.getElementById("currentUsername")?.classList.toggle("hidden");
				document.getElementById("changedUsername")?.classList.toggle("hidden");
			});
			
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