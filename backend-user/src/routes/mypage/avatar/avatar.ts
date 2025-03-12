import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
	//파일 경로만 만들어서 반환하면 됨 (backend_user/id)
	return { root: true }
  })
}

export default root;
