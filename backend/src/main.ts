import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3000', // React 앱이 실행되는 주소
    credentials: true, // 쿠키 공유를 허용하려면 true로 설정
  });
  await app.listen(4000);
}
bootstrap();
