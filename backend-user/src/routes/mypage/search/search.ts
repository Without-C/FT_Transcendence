import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
	return { root: true }
  })
}

// const users = await prisma.follows.findMany({
// 	where: { username: {startsWith: 'a'}  },
// 	select: { username : true }
//   })

export default root;
