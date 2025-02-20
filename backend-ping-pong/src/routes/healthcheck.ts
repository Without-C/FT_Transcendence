import { FastifyPluginAsync } from 'fastify'

const healthcheck: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/healthcheck', async function (request, reply) {
        return { healthcheck: true }
    })
}

export default healthcheck;
