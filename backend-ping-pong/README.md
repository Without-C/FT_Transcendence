# Duel WebSocket Message Step
```
a1. wait            // WebSocket 연결 되었을 때 -> 한 번 전송

a2. game_start      // 게임 시작할 때           -> 한 번 전송
    b1. countdown   // 매 라운드 시작하기 전    -> 세 번(3, 2, 1 countdown) 전송
    b2. round_start // 매 라운드 시작하기 직전  -> 한 번 전송
    b3. game_state  // 게임이 진행 중일 때      -> 1초에 60번 씩 전송
    b4. round_end   // 매 라운드가 끝난 직후    -> 한 번 전송
a3. game_end        // 게임이 끝난 후           -> 한 번 전송
```

```
x1. opponent_exit   // 게임 도중 상대방이 나갔을 때 -> 최대 한 번 전송
```