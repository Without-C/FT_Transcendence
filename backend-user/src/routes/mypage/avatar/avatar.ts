import { FastifyPluginAsync } from 'fastify'
import path from 'path';
import jwt from '@fastify/jwt'
import fs from 'fs';
import multipart from '@fastify/multipart';
import util from 'util';
import fastifyStatic from '@fastify/static';



const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	await fastify.register(jwt, {
		secret: "my-secret"
	})
	// /uploads 폴더를 /static 경로로 공개
	fastify.register(fastifyStatic, {
		root: path.join(process.cwd(), 'uploads'),  // 실제 이미지 저장 경로
		prefix: '/static/',                         // 브라우저에서 접근할 경로 (URL)
	});
	await fastify.register(multipart)
  	fastify.get('/', async function (request, reply) {

	//파일 경로만 만들어서 반환하면 됨 (backend_user/id)
	const userCookie = request.cookies.auth_token; // 쿠키 받아오기
	const decoded = fastify.jwt.verify<{ id: number }>(userCookie || ''); // 2️⃣ JWT 검증 및 디코딩
    const userId = decoded.id; //유저 id 받기
	const imageUrl = `/static/${userId}.jpg`; // 정적 경로 구성
  	return { avatar_url: imageUrl };
	// const uploadsDir = path.join(process.cwd(), 'uploads'); // 사진 파일 경로
	// const filePath = path.join(path.join(uploadsDir, userId.toString()), ".jpg"); // 사진 파일 이름

	// 파일이 존재하는지 확인
	// if (!fs.existsSync(filePath)) {
    //     return reply.status(404).send({ error: 'Image not found' });
    // }

	// reply.header('Content-Type', 'image/png');
	// reply.header('Content-Disposition', 'inline; filename="image.png"');

	// const stream = fs.createReadStream(filePath);
	// return reply.send(stream);
	// return { avatar_url : path.join(filePath, ".jpg") }; //  사진 파일 이름 + 확장자
	})
	
	
	//-> file폼으로 프론트에서 받게 api변경 필요
	fastify.post('/', async function (request, reply) {
		const file = await request.file(); // FormData의 'file' 필드

		if (!file) {
		  return reply.status(400).send({ error: 'No file uploaded' });
		}

		const userCookie = request.cookies.auth_token; // 쿠키 받아오기
		const decoded = fastify.jwt.verify<{ id: number }>(userCookie || ''); // 2️⃣ JWT 검증 및 디코딩
    	const userId = decoded.id; //유저 id 받기
		const uploadsDir = path.join(process.cwd(), 'uploads'); // 사진 파일 경로
		const filePath = path.join(path.join(uploadsDir, userId.toString()), ".jpg"); // 사진 파일 이

		const pump = util.promisify(require('stream').pipeline);
		try {
  		  // 스트림 저장
  		  await pump(file.file, fs.createWriteStream(filePath));
  		  return reply.send({ message: 'Upload complete', filename: `${userId}.jpg` });
  		} catch (err) {
  		  console.error(err);
  		  return reply.status(500).send({ error: 'File upload failed' });
  		}
	})
}


export default root;
