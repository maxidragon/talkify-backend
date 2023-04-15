import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: DbService) {}

  public async getConversationMembers(
    userId: number,
    conversationId: number,
  ): Promise<any> {
    try {
      const data = await this.prisma.conversationsUsers.findMany({
        where: {
          conversationId: conversationId,
        },
        select: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      let isMember = false;
      data.map((item: any) => {
        if (item.user.id === userId) {
          isMember = true;
        }
      });
      if (isMember) {
        return data;
      }
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async addConversationMember(
    memberId: number,
    conversationId: number,
    addedBy: number,
  ): Promise<any> {
    try {
      const isInConversation = await this.prisma.conversationsUsers.findMany({
        where: {
          userId: addedBy,
        },
      });
      if (!isInConversation) {
        return 'You are not in this conversation';
      }
      return await this.prisma.conversationsUsers.create({
        data: {
          userId: memberId,
          conversationId: conversationId,
        },
      });
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
}
