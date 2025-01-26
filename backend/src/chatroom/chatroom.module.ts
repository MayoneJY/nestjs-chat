import { Module } from '@nestjs/common';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './entities/chatroom/chatroom';

@Module({
    imports: [TypeOrmModule.forFeature([Chatroom])],
    controllers: [ChatroomController],
    providers: [ChatroomService],
    exports: [ChatroomService],
})
export class ChatroomModule {}
