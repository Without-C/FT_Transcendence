const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "http://localhost:8080", // 프론트엔드 주소에 맞게 설정
  credentials: true
}));
app.use(express.json());

// ✅ 유저 관련 API
app.get("/api/user/mypage/username", (req, res) => {
  res.json({ username: "somilee" });
});

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

app.get("/api/user/mypage/avatar", (req, res) => {
  res.json({ avatar_url: "https://ecimg.cafe24img.com/pg493b81297356041/redweek11/web/upload/ezst/image/ez-image-contents-1x5f0mb-1-1yussdb-3.jpg?v=1693831332500" });
});

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

app.get("/api/user/mypage/following", (req, res) => {
  res.json([
    { username: "younghoc", online: 1 },
    { username: "yeoshin", online: 0 },
    { username: "jjhang", online: 1 }
  ]);
});

app.get("/api/user/mypage/followers", (req, res) => {
  res.json({ follower_number: 2 });
});

app.post("/api/user/mypage/follow", (req, res) => {
  const { follow_username } = req.body;
  if (!follow_username) {
    return res.status(400).json({ error_code: 9, error_msg: "follow username missing" });
  }
  res.status(200).json({});
});

app.delete("/api/user/mypage/unfollow", (req, res) => {
  const { unfollow_username } = req.body;
  if (!unfollow_username) {
    return res.status(400).json({ error_code: 10, error_msg: "unfollow error" });
  }
  res.status(200).json({});
});

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

// ✅ 게임 관련 API
app.get("/api/game/history", (req, res) => {
  const { playmode } = req.query;
  console.log("👉 GET /api/game/history", playmode);

  if (playmode === "single") {
    return res.status(200).json([
      {
        game_end_reason: "normal",
        player1: { username: "somilee", round_score: 2, result: "winner" },
        player2: { username: "jjhang", round_score: 1, result: "loser" },
        date: "2025-03-02"
      },
      {
        game_end_reason: "normal",
        player1: { username: "somilee", round_score: 2, result: "winner" },
        player2: { username: "yeoshin", round_score: 0, result: "loser" },
        date: "2025-03-03"
      }
    ]);
  }

  if (playmode === "tournament") {
    return res.status(200).json([
      {
        date: "2025-03-02",
        game: [
          {
            game_end_reason: "normal",
            player1: { username: "somilee", round_score: 2, result: "winner" },
            player2: { username: "jjhang", round_score: 1, result: "loser" }
          },
          {
            game_end_reason: "normal",
            player1: { username: "somilee", round_score: 2, result: "winner" },
            player2: { username: "yeoshin", round_score: 1, result: "loser" }
          },
          {
            game_end_reason: "normal",
            player1: { username: "somilee", round_score: 2, result: "winner" },
            player2: { username: "younghoc", round_score: 1, result: "loser" }
          }
        ]
      }
    ]);
  }

  return res.status(400).json({ error_code: 999, error_msg: "invalid playmode" });
});

// ✅ 인증 관련 API
app.get("/api/auth/login/:provider", (req, res) => {
  const { provider } = req.params;
  console.log(`🔁 Redirecting to ${provider} login...`);
  res.redirect(`http://localhost:4000/api/auth/callback/${provider}`);
});

app.get("/api/auth/callback/:provider", (req, res) => {
  const { provider } = req.params;
  console.log(`✅ Received ${provider} login callback`);
  res.cookie("token", "mock-jwt-token", { httpOnly: true });
  res.status(200).send(`<h2>✅ ${provider} 로그인 성공 (쿠키 발급됨)</h2>`);
});

app.delete("/api/auth/logout", (req, res) => {
  console.log("👋 로그아웃 요청");
  res.clearCookie("token");
  res.status(200).json({});
});

app.get("/api/auth/me", (req, res) => {
  if (!req.headers.cookie?.includes("token")) {
    return res.status(401).json({ error_code: 401, error_msg: "Unauthorized" });
  }
  res.status(200).json({ username: "somilee" });
});

app.listen(4000, () => {
  console.log("✅ Mock API server is running at http://localhost:4000");
});
