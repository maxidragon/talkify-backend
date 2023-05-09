import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'X-Requested-With,Content-Type',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
      'Origin',
    ],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleDisconnect(client: Socket) {
    this.server.emit('users-changed', { user: client.id, event: 'left' });
  }
  @SubscribeMessage('enterConversation')
  async enterChatRoom(client: Socket, roomId: string) {
    client.join(roomId);
    client.broadcast
      .to(roomId)
      .emit('users-changed', { user: client.id, event: 'joined' });
    console.log('user joined', client.id, roomId);
  }

  @SubscribeMessage('leaveConversation')
  async leaveChatRoom(client: Socket, roomId: string) {
    client.broadcast
      .to(roomId)
      .emit('users-changed', { user: client.id, event: 'left' });
    client.leave(roomId);
  }

  @SubscribeMessage('message')
  handleMessage(payload: { conversationId: number; message: any }): void {
    const { conversationId, message } = payload;
    this.server
      .in(conversationId as unknown as string)
      .emit('message', message);
  }
}
