import { FastifyPluginAsync } from 'fastify'

const prisma: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/create_and_list', async function (request, reply) {
        await fastify.prisma.user.create({
            data: {
                username: `user_${Math.random().toString(36).substring(2, 8)}`,
            },
        })

        const allUsers = await fastify.prisma.user.findMany();

        return { users: allUsers };
    })
}

export default prisma;
