import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly onlineUsers: string[] = [];

  addOnlineUser(userId: string) {
    if (!this.onlineUsers.includes(userId)) {
      this.onlineUsers.push(userId);
    }
  }

  removeOnlineUser(userId: string) {
    const index = this.onlineUsers.indexOf(userId);
    if (index !== -1) {
      this.onlineUsers.splice(index, 1);
    }
  }

  getOnlineUsers(): string[] {
    return this.onlineUsers;
  }
}
