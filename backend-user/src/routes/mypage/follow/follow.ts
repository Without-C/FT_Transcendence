import { FastifyPluginAsync } from 'fastify'
import jwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	await fastify.register(jwt, {
			secret: fastify.config.SECRET
		})
	await fastify.register(fastifyCookie);

  	// fastify.post('/', async function (request, reply) {
	// 	const userCookie = request.cookies.auth_token; // 쿠키 받아오기
	// 	const decoded = fastify.jwt.verify<{ id: number }>(userCookie || ''); // 2️⃣ JWT 검증 및 디코딩
    // 	const userId = decoded.id; //유저 id 받기
	// 	const body = request.body as {
	// 		follow_username?: string;
	// 	};
	// 	const user = await fastify.prisma.user.findFirst({
	// 		where: {
	// 			oauth_id_42: String(userId),
	// 		},
	// 	})
	// 	String const followerId = user. 
	// 	Stirng const followingUsername = 
	// 	if (user?.username == body.follow_username)
	// 	{
	// 		console.log("자기 자신은 팔로우할 수 없습니다.");
	// 		return;
	// 	}
	// 	else
	// 	{
	// 		await fastify.prisma.follow.create({
	// 		data: { userId, body.followingUsername }
	// 	})}
	// 	return { root: true }
  	// })
}

export default root;

// async function followUser(fastify: any, followerId: String, followingUsername: String) {
// 	await fastify.prisma.follows.create({
// 		data: { followerId, followingUsername }
// 	})
// }