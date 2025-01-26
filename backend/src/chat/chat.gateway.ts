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
  handleJoinRoom(@MessageBody() data: { room: string; username: string }, @ConnectedSocket() client: Socket){
    
    client.join(data.room);
    this.server.to(data.room).emit('sendMessage', { user: 'System', message: `${data.username}님이 입장하셨습니다.` });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() data: { room: string; username: string }, @ConnectedSocket() client: Socket){
    client.leave(data.room);
    this.server.to(data.room).emit('sendMessage', { user: 'System', message: `${data.username}님이 퇴장하셨습니다.` });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() message: { chatroomId: number; room: string; user: string; message: string }){
    await this.chatService.addMessageQueue(message.user, message.chatroomId, message.message);
    this.server.to(message.room).emit('sendMessage', message);
  }

}
