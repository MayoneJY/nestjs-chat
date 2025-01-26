import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from 'src/chatroom/entities/chatroom/chatroom';

@Module({
  imports: [TypeOrmModule.forFeature([Chatroom])],
  providers: [ChatGateway, ChatroomService]
})
export class ChatModule {}
