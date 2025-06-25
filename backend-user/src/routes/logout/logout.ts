import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'
import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	await fastify.register(cookie, {
		secret: fastify.config.SECRET, // for cookies signature
		parseOptions: {}     // options for parsing cookies
	  } as FastifyCookieOptions)

	fastify.get('/', async function (request, reply) {
		for (let cookieName in request.cookies)
		{
			reply.clearCookie(cookieName);
		}
		
		reply.redirect(fastify.config.FRONTEND_URL + `/`);
	})
};


export default root;
