import jsonServer from '../../json-server';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ✅ 친구 삭제 API - username으로 삭제
server.delete('/user/following/:username', (req, res) => {
    const db = router.db; // lowdb 인스턴스
    const user = db.get('user').value();

    // ✅ 해당 유저 제거
    user.following = user.following.filter(friend => friend.username !== req.params.username);

    // ✅ 변경된 데이터 저장
    db.set('user', user).write();

    res.status(204).end(); // 성공 응답
});

server.use(router);
server.listen(4000, () => {
    console.log('✅ 커스텀 JSON Server가 4000번 포트에서 실행 중');
});
