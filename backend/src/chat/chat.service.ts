import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat/chat'
import { Chatroom } from 'src/chatroom/entities/chatroom/chatroom';

interface Message{
    user: string;
    message: string;
    createAt: Date;
}

interface MessageQueue{
    chatroomId: number; // 채팅방 id
    data: Message[];
}

@Injectable()
export class ChatService {
    private messageQueue: MessageQueue[] = [];
    private isProcessing = false;
    
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
        @InjectRepository(Chatroom)
        private chatroomRepository: Repository<Chatroom>,
    ) {
        setInterval(() => this.saveMessageQueue(), 1000);
    }
    
    private async saveMessageQueue(){
        if (this.isProcessing || this.messageQueue.length === 0) {
            console.log('saveMessageQueue: 중복 처리 중이거나 큐가 비었음');
            return; // 이미 처리 중이거나 큐가 비었으면 중단
        }
        this.isProcessing = true;

        for (const messageQueue of this.messageQueue) {
            const chatroomId = messageQueue.chatroomId;
            const chatroom = await this.chatroomRepository.findOne({where: {chatroomId}});
            if (!chatroom) {
                continue;
            }
            const chats: Chat[] = new Array<Chat>();
            for (const message of messageQueue.data) {
                const chat = new Chat();
                chat.chatroom = chatroom;
                chat.user = message.user;
                chat.message = message.message;
                chat.createAt = message.createAt;
                chats.push(chat);
            }
            await this.chatRepository.save(chats);
        }
        this.messageQueue = [];
        this.isProcessing = false;
        console.log('saveMessageQueue: 처리 완료');
    }

    public async addMessageQueue(user: string, chatroomId: number, message: string){
        const messageQueue = this.messageQueue.find((queue) => queue.chatroomId === chatroomId);
        const messageData: Message = {
            user,
            message,
            createAt: new Date(),
        };
        if (messageQueue) {
            messageQueue.data.push(messageData);
        } else {
            this.messageQueue.push({
                chatroomId,
                data: [messageData],
            });
        }
    }
}
