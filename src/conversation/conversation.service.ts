import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { AddUserDto } from './dto/addUser.dto';

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
    body: AddUserDto,
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
      await this.prisma.conversationsUsers.create({
        data: {
          userId: body.userId,
          conversationId: body.conversationId,
          addedById: addedBy,
        },
      });

      return 'User added';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getConversation(
    userId: number,
    conversationId: number,
    skip: number,
    take: number,
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
                skip: skip,
                take: take,
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
                  sendTime: 'desc',
                },
              },
            },
          },
        },
      });
      result[0].conversation.messages.sort(function (a, b) {
        return a.sendTime.getTime() - b.sendTime.getTime();
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
          isAccepted: true,
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

  public async acceptInvitation(
    conversationId: number,
    userId: number,
  ): Promise<any> {
    try {
      await this.prisma.conversationsUsers.updateMany({
        where: { conversationId, userId },
        data: { isAccepted: true, acceptedTime: new Date() },
      });
      return 'Invitation accepted';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async createConversation(createdBy: number, name: string) {
    try {
      const conversation = await this.prisma.conversation.create({
        data: {
          name: name,
        },
      });
      await this.prisma.conversationsUsers.create({
        data: {
          userId: createdBy,
          conversationId: conversation.id,
          isAccepted: true,
          acceptedTime: new Date(),
          addedById: createdBy,
        },
      });
      return conversation;
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
}
