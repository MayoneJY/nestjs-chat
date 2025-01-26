import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './chatroom/entities/chatroom/chatroom';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ 
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mariadb', // 데이터베이스 종류
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Chatroom], // 사용할 엔티티
      synchronize: true, // 자동으로 스키마 동기화 (개발 환경에서만 사용 권장)
    }),
  ChatModule, ChatroomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
