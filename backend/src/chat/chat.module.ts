import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from 'src/chatroom/entities/chatroom/chatroom';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat/chat';

@Module({
  imports: [TypeOrmModule.forFeature([Chatroom]), TypeOrmModule.forFeature([Chat]),],
  providers: [ChatGateway, ChatroomService, ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
