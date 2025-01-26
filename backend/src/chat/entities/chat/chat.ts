import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Chatroom } from 'src/chatroom/entities/chatroom/chatroom';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    chatId: number;

    @ManyToOne(() => Chatroom, chatroom => chatroom.chats, { onDelete: 'CASCADE' }) // 관계 설정
    @JoinColumn({ name: 'chatroomId' }) // 외래 키 명시
    chatroom: Chatroom;

    @Column()
    user: string;
    
    @Column()
    message: string;

    @Column({ type: 'timestamp'})
    createAt: Date
}
