import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Chatroom {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    room: string;
}
