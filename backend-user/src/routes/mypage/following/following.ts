import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
	return { root: true }
  })
}


// 내가 팔로우하는 사람 목록
// const following = await prisma.follows.findMany({
// 	where: { followerId: 1 },
// 	select: { following: true }
//   })

export default root;
