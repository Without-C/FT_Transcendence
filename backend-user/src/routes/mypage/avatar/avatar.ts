import { FastifyPluginAsync } from 'fastify'
import path from 'path';
import jwt from '@fastify/jwt'
import fs from 'fs';
import multipart from '@fastify/multipart';
import util from 'util';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import { pipeline } from 'stream';


const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	await fastify.register(jwt, {
		secret: "my-secret"
	})
	await fastify.register(fastifyCookie);
	// /uploads 폴더를 /static 경로로 공개
	fastify.register(fastifyStatic, {
		root: '/app/uploads',  // 실제 이미지 저장 경로
		prefix: '/uploads/',   // 브라우저에서 접근할 경로 (URL)
	});
	await fastify.register(multipart)
  	fastify.get('/', async function (request, reply) {

	//파일 경로만 만들어서 반환하면 됨 (backend_user/id)
	const userCookie = request.cookies.auth_token; // 쿠키 받아오기
	const decoded = fastify.jwt.verify<{ id: number }>(userCookie || ''); // 2️⃣ JWT 검증 및 디코딩
    const userId = decoded.id; //유저 id 받기
	const imageUrl = `/api/user/mypage/avatar/uploads/${userId}.jpg`; // 정적 경로 구성
  	return { avatar_url: imageUrl };
	})
	
	
	fastify.post('/', async function (request, reply) {
		const file = await request.file(); // FormData의 'file' 필드
		
		if (!file) {
			return reply.status(400).send({ error: 'No file uploaded' });
		}
		
		
		const userCookie = request.cookies.auth_token; // 쿠키 받아오기
		const decoded = fastify.jwt.verify<{ id: number }>(userCookie || ''); // 2️⃣ JWT 검증 및 디코딩
    	const userId = decoded.id; //유저 id 받기
		const uploadsDir = path.join(process.cwd(), 'uploads'); // 사진 파일 경로
		const filePath = path.join(uploadsDir, `${userId}.jpg`); // 사진 파일 이
		
		const pump = util.promisify(pipeline);
		try {
			// 스트림 저장
  		  await pump(file.file, fs.createWriteStream(filePath));
  		  return reply.send({ message: 'Upload complete', filename: `${userId}.jpg` });
		} catch (err) {
			console.error(err);
  		  return reply.status(500).send({ error: 'File upload failed' });
		}
	})
	
	fastify.patch('/', async function (request, reply) {
		const file = await request.file(); // FormData의 'file' 필드
	
		if (!file) {
		  return reply.status(400).send({ error: 'No file uploaded' });
		}
	
		const userCookie = request.cookies.auth_token; // 쿠키 받아오기
		const decoded = fastify.jwt.verify<{ id: number }>(userCookie || ''); // 2️⃣ JWT 검증 및 디코딩
		const userId = decoded.id; //유저 id 받기
		const uploadsDir = path.join(process.cwd(), 'uploads'); // 사진 파일 경로
		const filePath = path.join(uploadsDir, `${userId}.jpg`); // 사진 파일 이름 추가
		
		try {
			await fs.unlinkSync(filePath);
			console.log('파일 삭제 성공!');
		} catch (err) {
			  console.error('파일 삭제 실패:', err);
		}
	
		const pump = util.promisify(pipeline);
		try {
			// 스트림 저장
			await pump(file.file, fs.createWriteStream(filePath));
			return reply.status(200).send();
		  } catch (err) {
			console.error(err);
			return reply.status(500).send({ error: 'File upload failed' });
		  }
	})
}


export default root;
