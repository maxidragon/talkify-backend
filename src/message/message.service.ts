import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: DbService) {}

  public async sendMessage(
    content: string,
    senderId: number,
    conversationId: number,
  ): Promise<string> {
    try {
      await this.prisma.message.create({
        data: {
          content: content,
          senderId: senderId,
          conversationId: conversationId,
        },
      });
      return 'Message sent';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async deleteMessage(
    senderId: number,
    messageId: number,
  ): Promise<any> {
    try {
      await this.prisma.message.deleteMany({
        where: { id: messageId, senderId: senderId },
      });
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async editMessage(
    senderId: number,
    messageId: number,
    content: string,
  ): Promise<any> {
    try {
      await this.prisma.message.updateMany({
        where: { id: messageId, senderId: senderId },
        data: { content: content, isEdited: true },
      });
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async searchMessages(
    userId: number,
    conversationId: number,
    content: string,
  ): Promise<any> {
    if (await this.isInConversation(conversationId, userId)) {
      return this.prisma.message.findMany({
        where: {
          conversationId: conversationId,
          content: {
            contains: content,
          },
        },
      });
    }
  }
  public async isInConversation(
    userId: number,
    conversationId: number,
  ): Promise<boolean> {
    const conversationUser = await this.prisma.conversationsUsers.findMany({
      where: { conversationId: conversationId, userId: userId },
    });
    return conversationUser.length > 0;
  }
}
