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
}
