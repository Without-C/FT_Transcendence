import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
	return { root: true }
  })
}

export default root;

// async function followUser(followerId: number, followingId: number) {
// 	if (followerId === followingId) {
// 	  console.log("자기 자신은 팔로우할 수 없습니다.");
// 	  return;
// 	}
  
// 	await prisma.follows.create({
// 	  data: { followerId, followingId }
// 	})
//   }