import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
	const userCookie = request.cookies.auth_token; // 쿠키 받아오기
	const decoded = fastify.jwt.verify<{ id: number }>(userCookie || ''); // 2️⃣ JWT 검증 및 디코딩
    const userId = decoded.id; //유저 id 받기
	const user = await fastify.prisma.user.findFirst({
		where: {
			id: String(userId),
		},
	})
	return (user?.username);
  })
  fastify.patch('/', async function (request, reply) {

	const userCookie = request.cookies.auth_token; // 쿠키 받아오기
	const decoded = fastify.jwt.verify<{ id: number }>(userCookie || ''); // 2️⃣ JWT 검증 및 디코딩
    const userId = decoded.id; //유저 id 받기
	const body = request.body as {
		username?: string;
	};
	await fastify.prisma.user.update({
		where: { id: String(userId) },
		data: { username: body.username },
	});
  })

}

export default root;
