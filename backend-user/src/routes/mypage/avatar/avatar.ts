import { FastifyPluginAsync } from 'fastify'
import path from 'path';
import jwt from '@fastify/jwt';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	await fastify.register(jwt, {
			secret: "my-secret"
		})
  	fastify.get('/', async function (request, reply) {

	//파일 경로만 만들어서 반환하면 됨 (backend_user/id)
	const userCookie = request.cookies.auth_token; // 쿠키 받아오기
	const decoded = fastify.jwt.verify<{ id: number }>(userCookie); // 2️⃣ JWT 검증 및 디코딩
    const userId = decoded.id; //유저 id 받기
	const uploadsDir = path.join(process.cwd(), 'uploads'); // 사진 파일 경로
	const filePath = path.join(uploadsDir, userId.toString()); // 사진 파일 이름
	return { avatar_url : path.join(filePath, ".jpg") }; //  사진 파일 이름 + 확장자
  })
}

export default root;
