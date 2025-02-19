import { FastifyPluginAsync } from 'fastify'
//import fp from 'fastify-plugin'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {

	const authUrl = `https://api.intra.42.fr/oauth/authorize?` +
    `client_id=${process.env.OAUTH_UID_42 || ''}&` +
    `redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_42 || '')}&` +  // 기본값 추가
    `response_type=code`

  	reply.redirect(authUrl)
  })
};
export default root;
