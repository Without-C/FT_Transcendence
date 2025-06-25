import { FastifyPluginAsync } from 'fastify'
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	await fastify.register(jwt, {
			secret: fastify.config.SECRET,
		})
		
		await fastify.register(cookie, {
			secret: fastify.config.SECRET, // 쿠키 서명에 사용할 비밀 키
			parseOptions: {}  // 쿠키 파싱 옵션
		});

  	fastify.get('/', async function (request, reply) {
		const userCookie = request.cookies.auth_token; // 쿠키 받아오기
		const decoded = fastify.jwt.verify<{ id: number }>(userCookie || ''); // 2️⃣ JWT 검증 및 디코딩
    	const userId = decoded.id; //유저 id 받기
		const user = await fastify.prisma.user.findFirst({
			where: {
				oauth_id_42: String(userId),
			},
		})
		reply.send({username: user?.username})
		
  	})
  fastify.patch('/', async function (request, reply) {

	const userCookie = request.cookies.auth_token; // 쿠키 받아오기
	const decoded = fastify.jwt.verify<{ id: number }>(userCookie || ''); // 2️⃣ JWT 검증 및 디코딩
    const userId = decoded.id; //유저 id 받기
	const body = request.body as {
		username?: string;
	};
	await fastify.prisma.user.update({
		where: { oauth_id_42: String(userId) },
		data: { username: body.username },
	});
  })

}

export default root;
