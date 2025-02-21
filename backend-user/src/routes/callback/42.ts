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
		//return reply.send({ message: "Received OAuth Code", code });
		const url = 'https://api.intra.42.fr/oauth/token';

		const data = qs.stringify({
			grant_type: 'authorization_code',
			client_id: `${process.env.OAUTH_UID_42}`,
			client_secret: `${process.env.OAUTH_SECRET_42}`,
			code: code,
			redirect_uri: 'http://localhost/api/auth/callback/42',
		});

		const response = await axios.post(url, data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		});

		//reply.send({ success: true, message: 'Callback processed' });
		reply.send({ success: true, message: response.data });
		//console.log('POST request sent successfully:', response.data);
		//} catch (error) {
		//	console.error('Error sending POST request:', error);
		//	reply.status(500).send({ success: false, message: 'Error processing callback' });
		//}

		return;
	})
}

export default callback42;
