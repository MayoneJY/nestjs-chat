import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatroom } from './entities/chatroom/chatroom';
import { get } from 'http';

@Injectable()
export class ChatroomService {
    constructor(
        @InjectRepository(Chatroom)
        private chatroomRepository: Repository<Chatroom>,
    ) {}

    async createChatroom(room: string): Promise<Boolean> {
        if (room === 'home') {
            return false;
        }
        const findroom: Chatroom|null = await this.getChatroom(room);
        if (findroom) {
            return false;
        }
        const chatroom = new Chatroom();
        chatroom.room = room;
        await this.chatroomRepository.save(chatroom);
        return true;
    }

    async getChatrooms(): Promise<string[]> {
        const rooms: Chatroom[] = await this.chatroomRepository.find();
        return rooms.map((room: Chatroom) => room.room);
    }

    async getChatroom(room: string): Promise<Chatroom|null> {
        const chatroom: Chatroom|null = await this.chatroomRepository.findOne({ where: { room } });
        if (chatroom) {
            return chatroom;
        }
        else return null;
    }

    async deleteChatroom(room: string): Promise<void> {
        await this.chatroomRepository.delete({ room });
    }
}
