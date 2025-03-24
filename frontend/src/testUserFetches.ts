import {
  fetchAvatar,
  fetchUsername,
  updateAvatar,
  updateUsername,
  fetchFollowing,
  fetchFollow,
  followUser,
  unfollowUser,
  searchUsers
} from "./api/user";

import {
	fetchSingleGames,
	fetchTournamentGames
} from "./api/game";

import {
	logout
} from "./api/auth";

async function testApis() {
  try {
	//user API 확인
    console.log("🧪 fetchAvatar()");
    const avatar = await fetchAvatar();
    console.log("✅ avatar_url:", avatar.avatar_url);

    console.log("🧪 fetchUsername()");
    const username = await fetchUsername();
    console.log("✅ username:", username.username);

    console.log("🧪 updateAvatar()");
    await updateAvatar("https://placekitten.com/300/300.jpg");
    console.log("✅ updateAvatar() 성공");

    console.log("🧪 updateUsername()");
    await updateUsername("sominee");
    console.log("✅ updateUsername() 성공");

    console.log("🧪 fetchFollowing()");
    const following = await fetchFollowing();
    console.log("✅ following:", following);

    console.log("🧪 fetchFollow()");
    const follow = await fetchFollow();
    console.log("✅ follow:", follow);

    console.log('🧪 followUser("jjhang")');
    await followUser("jjhang");
    console.log("✅ followUser() 성공");

    console.log('🧪 unfollowUser("jjhang")');
    await unfollowUser("jjhang");
    console.log("✅ unfollowUser() 성공");

    console.log('🧪 searchUsers("j")');
    const results = await searchUsers("j");
    console.log("✅ searchUsers:", results);

	//game API 확인
	console.log('🧪 fetchSingleGames');
	const single = await fetchSingleGames();
	console.log("✅ 1vs1:", single);

	console.log('🧪 fetchTournamentGames');
	const tournament = await fetchTournamentGames();
	console.log("✅ 토너먼트:", tournament);

	//auth API 확인
	console.log("🧪 logout()");
	await logout();
	console.log("✅ logout() 성공");

  } catch (error) {
    console.error("❌ 에러 발생:", error.error_msg);
  }
}

testApis();
