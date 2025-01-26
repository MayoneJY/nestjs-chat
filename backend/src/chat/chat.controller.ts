import { Controller } from '@nestjs/common';
import { Get, Post, Delete, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get()
    async getChats(@Query('chatroomId') chatroomId: string, @Query('page') page: number | null) {
        if (!page) {
            page = 1;
        }
        return await this.chatService.getChats(parseInt(chatroomId), page);
    }
}
