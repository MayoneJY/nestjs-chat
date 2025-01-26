import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Chat } from 'src/chat/entities/chat/chat';

@Entity()
export class Chatroom {
    @PrimaryGeneratedColumn()
    chatroomId: number;
    
    @Column()
    room: string;

    @OneToMany(() => Chat, chat => chat.chatroom)
    chats: Chat[];
}
