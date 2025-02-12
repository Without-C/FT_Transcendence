import { FastifyPluginAsync } from "fastify"

const test: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return 'this is a test'
  })
}

export default test;
