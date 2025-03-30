import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
	return { root: true }
  })
}


// async function unfollowUser(followerId: number, followingId: number) {
// 	await prisma.follows.deleteMany({
// 	  where: { followerId, followingId }
// 	})
//   }
export default root;
