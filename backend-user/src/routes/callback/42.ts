import { FastifyPluginAsync } from 'fastify'

interface QueryString {
	Querystring: {
		code: string;
	};
}

const callback42: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get<QueryString>('/42', async function (request, reply) {
		const { code } = request.query;
		return reply.send({ message: "Received OAuth Code", code });
	})
}

export default callback42;
