import { Controller, NotFoundException } from '@nestjs/common';
import { ChatroomService } from './chatroom.service'
import { Get, Post, Delete, Body, Param } from '@nestjs/common';

@Controller('chatroom')
export class ChatroomController {
    constructor(private chatroomService: ChatroomService) {}

    @Post('create')
    async createChatroom(@Body('room') room: string) {
        return await this.chatroomService.createChatroom(room);
    }

    @Get()
    async getChatrooms() {
        return await this.chatroomService.getChatrooms();
    }

    @Get(':room')
    async getChatroom(@Param('room') room: string) {
        // return await this.chatroomService.getChatroom(room);
        const result = await this.chatroomService.getChatroom(room);
        if (result) {
            return result;
        }
        throw new NotFoundException('Chatroom not found');
    }

    @Delete(':room')
    async deleteChatroom(@Param('room') room: string) {
        await this.chatroomService.deleteChatroom(room);
    }
}
