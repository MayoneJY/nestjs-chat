import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({ cors: { origin: 'http://localhost:3000', credentials: true } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: { room: string; username: string }, @ConnectedSocket() client: Socket){
    
    client.join(data.room);
    this.server.to(data.room).emit('sendMessage', { username: 'System', content: `${data.username}님이 입장하셨습니다.` });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() data: { room: string; username: string }, @ConnectedSocket() client: Socket){
    client.leave(data.room);
    this.server.to(data.room).emit('sendMessage', { username: 'System', content: `${data.username}님이 퇴장하셨습니다.` });
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(@MessageBody() message: { room: string; username: string; content: string }){
    this.server.to(message.room).emit('sendMessage', message);
  }

}
