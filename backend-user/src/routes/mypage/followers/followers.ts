import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
	  // // 나를 팔로우하는 사람 목록
	// const followers = await prisma.follows.findMany({
	// 	where: { followingId: 1 },
	//   	select: { follower: true }
	// 	})
	return { follower : 0 }
  })
}

export default root;
