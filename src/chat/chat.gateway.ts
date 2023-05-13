import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('enterConversation')
  handleRoomJoin(client: Socket, room: string) {
    client.join(room);
    client.emit('enteredConversation', room);
  }

  handleMessage(payload: { conversationId: number; message: any }): void {
    const { conversationId, message } = payload;
    const roomId = conversationId.toString();
    this.wss.to(roomId.toString()).emit('message', message);
  }
}
