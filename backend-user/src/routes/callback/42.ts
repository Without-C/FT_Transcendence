import { FastifyPluginAsync } from 'fastify'
import axios from 'axios';
import qs from 'qs';


interface QueryString {
	Querystring: {
		code: string;
	};
}

const callback42: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get<QueryString>('/42', async function (request, reply) {
		const { code } = request.query; // authenticate code calback으로 받아옴

		const url = 'https://api.intra.42.fr/oauth/token'; //해당 url에서 access token 받아옴
		const data = qs.stringify({
			grant_type: 'authorization_code',
			client_id: `${process.env.OAUTH_UID_42}`,
			client_secret: `${process.env.OAUTH_SECRET_42}`,
			code: code,
			redirect_uri: 'http://localhost/api/auth/callback/42',
		}); //요청 쿼리 내용

		const response = await axios.post(url, data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		}); //요청 post -> response에 응답 담겨서 온다.

		const userinfo = await axios.get("https://api.intra.42.fr/v2/me", {
			headers: {
				Authorization: `Bearer ` + response.data.access_token
			}
		}); //요청 post -> response에 응답 담겨서 온다.
		//response.data
		reply.send({ success: true, access_token: userinfo.data });

		return;
	})
}

export default callback42;
