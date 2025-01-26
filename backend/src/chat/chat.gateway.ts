import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';


@WebSocketGateway({ cors: { origin: 'http://localhost:3000', credentials: true } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody() data: { chatroomId: number; room: string; user: string }, @ConnectedSocket() client: Socket){
    console.log('join' + data.chatroomId);
    await this.chatService.addMessageQueue('System', data.chatroomId, `${data.user}님이 입장하셨습니다.`);
    client.join(data.room);
    this.server.to(data.room).emit('sendMessage', { user: 'System', message: `${data.user}님이 입장하셨습니다.` });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@MessageBody() data: { chatroomId: number; room: string; user: string }, @ConnectedSocket() client: Socket){
    console.log('leave' + data.chatroomId);
    await this.chatService.addMessageQueue('System', data.chatroomId, `${data.user}님이 퇴장하셨습니다.`);
    client.leave(data.room);
    this.server.to(data.room).emit('sendMessage', { user: 'System', message: `${data.user}님이 퇴장하셨습니다.` });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() message: { chatroomId: number; room: string; user: string; message: string }){
    await this.chatService.addMessageQueue(message.user, message.chatroomId, message.message);
    this.server.to(message.room).emit('sendMessage', message);
  }

}
