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

async function testUserApis() {
  try {
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
  } catch (error) {
    console.error("❌ 에러 발생:");
  }
}

testUserApis();
