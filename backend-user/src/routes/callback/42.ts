import { FastifyPluginAsync } from 'fastify'
import axios from 'axios';
import qs from 'qs';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import fs from 'fs';
import path from 'path';

interface QueryString {
	Querystring: {
		code: string;
	};
}



const callback42: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	await fastify.register(jwt, {
		secret: fastify.config.SECRET
	})
	
	await fastify.register(cookie, {
		secret: fastify.config.SECRET, // 쿠키 서명에 사용할 비밀 키
		parseOptions: {}  // 쿠키 파싱 옵션
	});
	
	const uploadsDir = path.join(process.cwd(), 'uploads');
	if (!fs.existsSync(uploadsDir)) {
		fs.mkdirSync(uploadsDir, { recursive: true });
	}

	fastify.get<QueryString>('/42', async function (request, reply) {

		
		const { code } = request.query; // authenticate code calback으로 받아옴

		const url = 'https://api.intra.42.fr/oauth/token'; //해당 url에서 access token 받아옴
		const data = qs.stringify({
			grant_type: 'authorization_code',
			client_id: `${process.env.OAUTH_UID_42}`,
			client_secret: `${process.env.OAUTH_SECRET_42}`,
			code: code,
			redirect_uri: fastify.config.OAUTH_REDIRECT_42,
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
		}); //요청 post -> accesstoken으로 유저 정보 받아오는 부분

		//유저가 한 명인지 확인
		const existingUser = await fastify.prisma.user.findFirst({
			where: { oauth_id_42: String(userinfo.data.id) },
		});
		//유저 존재하지 않는다면 새 유저 만들어서 저장
		if (!existingUser) {
			
			await downloadAndSaveImage(
				userinfo.data.image.link,
				String(userinfo.data.id),
				uploadsDir
			  );

			const newUser = await fastify.prisma.user.create({
				data: {
					username: String(userinfo.data.login),//인트라 아이디 저장www
					oauth_id_42: String(userinfo.data.id), // 직접 ID 지정
				},
			});
			console.log('새로운 유저 생성:', newUser);
		}
		else
			console.log('유저가 이미 존재합니다:', existingUser);
	
		const token = fastify.jwt.sign({ id : userinfo.data.id });

		reply.cookie('auth_token', token, {
			httpOnly: true, // 클라이언트 사이드 자바스크립트에서 접근 불가능
			secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 Secure 플래그 활성화
			path: '/', // 전체 도메인에서 쿠키 사용
			});

		reply.redirect(fastify.config.FRONTEND_URL + '/#/play');
		return;
	})
}

async function downloadAndSaveImage(imageUrl: string, userId: string, uploadsDir: string): Promise<string | null> {
	try {
	  // URL에서 이미지 파일을 다운로드
	  const imageResponse = await axios({
		url: imageUrl,
		method: 'GET',
		responseType: 'arraybuffer', // 바이너리 데이터로 받기
	  });
	
	  // 파일명 생성
	  const fileName = `${userId}.jpg`;
	  const filePath = path.join(uploadsDir, fileName);
	
	  // 파일을 로컬 서버에 저장
	  fs.writeFileSync(filePath, imageResponse.data);
	  console.log('이미지 저장 완료:', filePath);
	  
	  return filePath;
	} catch (error) {
	  console.error('이미지 저장 실패:', error);
	  return null;
	}
  }


export default callback42;
