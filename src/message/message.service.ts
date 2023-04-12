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

  public async getConversation(
    userId: number,
    conversationId: number,
  ): Promise<any> {
    try {
      const result = await this.prisma.conversationsUsers.findMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
        select: {
          conversation: {
            select: {
              id: true,
              name: true,
              messages: {
                select: {
                  id: true,
                  content: true,
                  sendTime: true,
                  sender: {
                    select: {
                      id: true,
                      username: true,
                    },
                  },
                },
                orderBy: {
                  sendTime: 'asc',
                },
              },
            },
          },
        },
      });
      return result[0].conversation;
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getUserConversations(userId: number): Promise<any> {
    try {
      return await this.prisma.conversationsUsers.findMany({
        where: {
          userId: userId,
        },
        select: {
          conversation: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
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
