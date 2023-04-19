import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
    this.chatService.removeOnlineUser(client.id);
    this.server.emit('online-users', this.chatService.getOnlineUsers());
  }

  @SubscribeMessage('join')
  handleJoin(client: any, userId: string) {
    console.log(`User ${userId} joined the chat`);
    this.chatService.addOnlineUser(userId);
    this.server.emit('online-users', this.chatService.getOnlineUsers());
  }

  @SubscribeMessage('leave')
  handleLeave(client: any, userId: string) {
    console.log(`User ${userId} left the chat`);
    this.chatService.removeOnlineUser(userId);
    this.server.emit('online-users', this.chatService.getOnlineUsers());
  }
}
