import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatroomService } from 'src/chatroom/chatroom.service';


@WebSocketGateway({ cors: { origin: 'http://localhost:3000', credentials: true } })
export class ChatroomGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatroomService: ChatroomService) {}

  @SubscribeMessage('getRooms')
  async handleGetRooms(@ConnectedSocket() client: Socket){
    client.join('home');
    // const rooms = Array.from(this.server.sockets.adapter.rooms.keys());
    // const filteredRooms = rooms.filter((room) => !this.server.sockets.adapter.sids.has(room)); 
    // client.emit('sendRooms', filteredRooms);

    const rooms: string[] = await this.chatroomService.getChatrooms();
    client.emit('sendRooms', rooms);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket){
    const result: Boolean = await this.chatroomService.createChatroom(room);
    if (!result) {
      client.emit('errorRoom', "이미 존재하는 방이거나 사용할 수 없는 이름입니다.");
    }
    else{
      this.server.to('home').emit('createRoom', room);
    }
  }

  @SubscribeMessage('deleteRoom')
  async handleDeleteRoom(@MessageBody() room: string){
    await this.chatroomService.deleteChatroom(room);
    this.server.to('home').emit('removeRoom', room);
  }
}
