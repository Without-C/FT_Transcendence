import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
	const users = [
		{ username: 'younghoc', online: 1 },
		{ username: 'yeoshin', online: 0 },
		{ username: 'jjhang', online: 1 },
	  ]
	  return users
	})
}


// 내가 팔로우하는 사람 목록
// const following = await prisma.follows.findMany({
// 	where: { followerId: 1 },
// 	select: { following: true }
//   })

export default root;
