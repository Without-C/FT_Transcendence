const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ GET: 유저 이름
app.get("/api/user/mypage/username", (req, res) => {
  res.json({ username: "somilee" });
});

// ✅ PATCH: 유저 이름 변경
app.patch("/api/user/mypage/username", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error_code: 2, error_msg: "empty username" });
  }
  if (username.length > 10) {
    return res.status(400).json({ error_code: 1, error_msg: "too long username" });
  }
  res.status(200).json({});
});

// ✅ GET: 프로필 이미지
app.get("/api/user/mypage/avatar", (req, res) => {
  res.json({ avatar_url: "https://placekitten.com/200/200" });
});

// ✅ PATCH: 프로필 이미지 변경
app.patch("/api/user/mypage/avatar", (req, res) => {
  const { avatar_url } = req.body;
  if (!avatar_url) {
    return res.status(400).json({ error_code: 3, error_msg: "empty file" });
  }
  if (!avatar_url.endsWith(".jpg") && !avatar_url.endsWith(".png")) {
    return res.status(400).json({ error_code: 4, error_msg: "wrong extension" });
  }
  res.status(200).json({});
});

// ✅ GET: 팔로잉 목록
app.get("/api/user/mypage/following", (req, res) => {
  res.json([
    { username: "younghoc", online: 1 },
    { username: "yeoshin", online: 0 },
    { username: "jjhang", online: 1 }
  ]);
});

// ✅ GET: 팔로워 수 (임시)
app.get("/api/user/mypage/followers", (req, res) => {
  res.json({ following_username: "somilee" });
});

// ✅ POST: 팔로우
app.post("/api/user/mypage/follow", (req, res) => {
  const { follow_username } = req.body;
  if (!follow_username) {
    return res.status(400).json({ error_code: 9, error_msg: "follow username missing" });
  }
  res.status(200).json({});
});

// ✅ DELETE: 언팔로우
app.delete("/api/user/mypage/unfollow", (req, res) => {
  const { unfollow_username } = req.body;
  if (!unfollow_username) {
    return res.status(400).json({ error_code: 10, error_msg: "unfollow error" });
  }
  res.status(200).json({});
});

// ✅ GET: 유저 검색
app.get("/api/user/mypage/search", (req, res) => {
  const keyword = req.query.searching_user;
  if (!keyword) {
    return res.status(400).json({ error_code: 12, error_msg: "searching error" });
  }
  const users = [
    { username: "younghoc", online: 1, following: 1 },
    { username: "yeoshin", online: 0, following: 0 },
    { username: "jjhang", online: 1, following: 0 }
  ];
  const result = users.filter(user => user.username.startsWith(keyword));
  res.status(200).json(result.length ? result : {});
});

app.listen(4000, () => {
  console.log("✅ Mock API server is running at http://localhost:4000");
});
