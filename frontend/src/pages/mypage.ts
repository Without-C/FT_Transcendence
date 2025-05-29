import {
	fetchAvatar,
	fetchUsername,
	updateAvatar,
	updateUsername,
	fetchFollowing,
	fetchFollow,
	followUser,
	unfollowUser,
	searchUsers,
	fetchSingleGames,
	fetchTournamentGames
} from "@/api";

export async function renderMyPage() {
	try{
		const [
			avatar,
			username,
			following,
			follower,
			singleGames,
			tournamentGames
		  ] = await Promise.all([
			fetchAvatar().catch(error => {
				console.error("Avatar fetch error:", error);
				throw error;
			}),
			fetchUsername().catch(error => {
				console.error("Username fetch error:", error);
				throw error;
			}),
			fetchFollowing().catch(error => {
				console.error("Following fetch error:", error);
				throw error;
			}),
			fetchFollow().catch(error => {
				console.error("Follow fetch error:", error);
				throw error;
			}),
			Promise.resolve([]),
			Promise.resolve([])
		  ]);
		
		const template = `
		<div class="flex flex-col items-center lg:flex-row lg:items-start lg:justify-center lg:gap-10 p-6 min-h-screen bg-black text-white">

		<section class="flex flex-col items-center gap-4 pt-20">

		  <div class="relative">
			<img src="${avatar.avatar_url}" class="w-40 h-40 rounded-full object-cover" alt="profile">
			<input type="file" id="fileInput" accept="image/*" class="hidden">
			<button id="profileImg" class="absolute bottom-2 right-2 bg-[#375433] px-2.5 py-1 rounded-full">✎</button>
		  </div>

		  <div id="username" class="flex flex-row gap-5">
			<div id="currentUsername" class="flex flex-row gap-5 hidden">
				<input id="usernameInput" type="text" maxlength="10" class="bg-[#162113] text-3xl font-bold text-[#9CCA95] px-2 w-50 rounded">
				<button id="currentUsernameInput" class="text-xl text-[#9CCA95] rounded-full">✎</button>
			</div>
			<div id="changedUsername" class="flex flex-row gap-5">
				<h2 class="text-[3vw] font-bold text-[#9CCA95]">${username.username}</h2>
				<button id="changedUsernameInput" class="text-xl text-[#9CCA95] rounded-full">✎</button>
			</div>
		  </div>
		</section>
	  
		<section class="flex flex-col w-full max-w-3xl">
		  <div class="flex justify-end gap-4 text-[#9CCA95]">
			<span><strong>${following.length || 0}</strong> followers</span>
			<span><strong>${follower.follower_number || 0}</strong> following</span>
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
			const friendListElement = document.getElementById("friendList") as HTMLDivElement;
			const gameListElement = document.getElementById("gameList") as HTMLDivElement;
			const singleButton = document.querySelector("#single") as HTMLDivElement;
			const tournamentButton = document.querySelector("#tournament") as HTMLDivElement;
			const searchElement = document.getElementById("search") as HTMLDivElement;
			const profileImgButton = document.getElementById("profileImg") as HTMLDivElement;

			// friendList 랜더링
			const renderFriendList = () => {
				friendListElement.innerHTML = "";
				const searchIcon = document.querySelector("#searchOrDelete") as HTMLButtonElement;
				searchIcon.textContent = "🔍";

				following.forEach((friend, idx) => {
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
						try{
							if(unfollowBtn.textContent == "Unfollow") {
								await unfollowUser(friend.username);
								unfollowBtn.textContent = "Follow"
							} else {
								await followUser(friend.username);
								unfollowBtn.textContent = "Unfollow"
							}
						} catch(error) {
							console.error(" 언팔로우 실패");
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
				singleGames.forEach((single, idx) => {
					const singlePlayList = document.createElement("li");
					singlePlayList.className = "flex justify-between items-center px-5 py-2 bg-[#162113]";

					const result = document.createElement("span");
					result.style.whiteSpace = "pre"; 
					if((single.player1.username === username.username && single.player1.result === "winner") ||
						(single.player2.username === username.username && single.player2.result === "winner")) {
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
				tournamentGames.forEach((tournament, idx) => {
					const tournamentPlayList = document.createElement("li");
					tournamentPlayList.className = "flex justify-between items-center px-5 py-2 bg-[#162113]";

					const result = document.createElement("span");
					result.style.whiteSpace = "pre";
					if((tournament.game[2].player1.username === username.username && tournament.game[2].player1.result === "winner") ||
						(tournament.game[2].player2.username === username.username && tournament.game[2].player2.result === "winner")) {
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
			const renderSearch = async (search = '') => {
				friendListElement.innerHTML = "";
				const searchIcon = document.querySelector("#searchOrDelete") as HTMLButtonElement;
				searchIcon.textContent = "❌";
				searchIcon?.addEventListener("click", () => {
					searchElement.value = ''; 
					renderFriendList();
				});
				if(search == '') {
					renderFriendList();
				}

				const keyUsers = await searchUsers(searchElement.value);
				keyUsers.forEach((friend, idx) => {
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
					if(friend.following == 0) {
						unfollowBtn.textContent = "Follow";
					} else {
						unfollowBtn.textContent = "Unfollow";
					}
					friendList?.appendChild(unfollowBtn);
					unfollowBtn.addEventListener("click", async () => {
						try{
							if(unfollowBtn.textContent == "Unfollow") {
								await unfollowUser(friend.username);
								unfollowBtn.textContent = "Follow"
							} else {
								await followUser(friend.username);
								unfollowBtn.textContent = "Unfollow"
							}
						} catch(error) {
							console.error(" 언팔로우 실패");
						}
					});
					friendList.appendChild(unfollowBtn);
	
					document.getElementById("friendList")?.appendChild(friendList);
				});
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
			
			//username 랜더링
			const renderName = () => {
				const currentUsernameInput = document.getElementById("currentUsernameInput");
				const changedUsernameInput = document.getElementById("changedUsernameInput");
			  
				currentUsernameInput?.addEventListener("click", async () => {
					const newName = document.getElementById("usernameInput") as HTMLInputElement;
			  
					if (newName.value.trim() !== '') {
						try {
							await updateUsername(newName.value);
					
							const nameHeading = document.querySelector("#changedUsername h2");
							if (nameHeading) {
								nameHeading.textContent = newName.value;
							}
					
							document.getElementById("currentUsername")?.classList.toggle("hidden");
							document.getElementById("changedUsername")?.classList.toggle("hidden");
							} catch (error) {
							console.error("이름 변경 실패:", error);
						}
				  	}
				});
			  
				changedUsernameInput?.addEventListener("click", () => {
				  document.getElementById("currentUsername")?.classList.toggle("hidden");
				  document.getElementById("changedUsername")?.classList.toggle("hidden");
				});
			};
			
			//profile image 랜더링
			const renderProfileImage = () => {
				const fileInput = document.getElementById("fileInput") as HTMLInputElement;
				const profileImg = document.querySelector("img[alt='profile']") as HTMLImageElement;

				fileInput.addEventListener("change", async (e) => {
					const file = (e.target as HTMLInputElement).files?.[0];
					if (!file) return;

					try {
						await updateAvatar(file);
						profileImg.src = URL.createObjectURL(file);
					} catch (error) {
						console.error("프로필 이미지 업로드 실패:", error);
					}
				});
			}
			
			renderProfileImage();
			renderName();
			renderFriendList();
			renderSingleList();
		});
		
		return template;
	} catch (error){
		console.error("에러발생: ", error);
		return "<h1>❌ 사용자 정보를 불러올 수 없습니다.</h1>";
	}
}