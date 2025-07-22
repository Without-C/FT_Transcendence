import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get('/', async function (request, reply) {

		const authUrl = `https://accounts.google.com/o/oauth2/auth?` +
			`client_id=${process.env.OAUTH_UID_GOOGLE || '123'}&` +
			`redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_GOOGLE || '')}&` +
			`response_type=code&`+
			`scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`
			reply.redirect(authUrl)
		})
	};
	// uri 예시
	/*
	https://accounts.google.com/o/oauth2/auth?client_id=[클라이언트ID]
	&redirect_uri=https://localhost:8080/auth/google/callback&response_type=code&
	scope=https://www.googleapis.com/auth/analytics
	*/
export default root;
