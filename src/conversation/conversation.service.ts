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
          isAdmin: true,
          addedBy: {
            select: {
              username: true,
            },
          },
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
          isAdmin: true,
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
                  isEdited: true,
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
      result[0].conversation.messages.map((item: any) => {
        item.isOwned = item.sender.id === userId;
      });
      return {
        ...result[0].conversation,
        isAdmin: result[0].isAdmin,
      };
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getUserConversations(userId: number): Promise<any> {
    try {
      const conversations = await this.prisma.conversationsUsers.findMany({
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
      const promises = conversations.map(async (conversation: any) => {
        conversation.conversation.numberOfUnreadMessages =
          await this.getNumberOfUnreadMessages(
            userId,
            conversation.conversation.id,
          );
        return conversation;
      });

      return await Promise.all(promises);
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

  public async declineInvitation(
    conversationId: number,
    userId: number,
  ): Promise<any> {
    try {
      await this.prisma.conversationsUsers.deleteMany({
        where: { conversationId, userId },
      });
      return 'Invitation declined';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getUserInvitations(userId: number) {
    try {
      return await this.prisma.conversationsUsers.findMany({
        where: {
          userId: userId,
          isAccepted: false,
        },
        select: {
          addedBy: {
            select: {
              username: true,
            },
          },
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

  public async getNumberOfInvitations(userId: number): Promise<any> {
    try {
      const result = await this.prisma.conversationsUsers.findMany({
        where: {
          userId: userId,
          isAccepted: false,
        },
      });
      return result.length;
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
          readTime: new Date(),
          isAdmin: true,
        },
      });
      return conversation;
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async removeUserFromConversation(
    userId: number,
    conversationId: number,
    deletedBy: number,
  ): Promise<any> {
    try {
      if (
        userId != deletedBy &&
        !(await this.isAdmin(deletedBy, conversationId))
      ) {
        return 'You are not admin';
      }
      await this.prisma.conversationsUsers.deleteMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
      });
      return 'User removed';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async addAdmin(
    userId: number,
    conversationId: number,
    addedBy: number,
  ) {
    if (!(await this.isAdmin(addedBy, conversationId))) {
      return 'You are not admin';
    }
    try {
      await this.prisma.conversationsUsers.updateMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
        data: {
          isAdmin: true,
        },
      });
      return 'Admin added';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async removeAdmin(
    userId: number,
    conversationId: number,
    deletedBy: number,
  ) {
    if (!(await this.isAdmin(deletedBy, conversationId))) {
      return 'You are not admin';
    }
    try {
      await this.prisma.conversationsUsers.updateMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
        data: {
          isAdmin: false,
        },
      });
      return 'Admin removed';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getNumberOfUnreadMessages(
    userId: number,
    conversationId: number,
  ) {
    try {
      const user = await this.prisma.conversationsUsers.findMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
        select: {
          readTime: true,
        },
      });
      if (user.length > 0) {
        try {
          const messages = await this.prisma.message.findMany({
            where: {
              conversationId: conversationId,
              sendTime: {
                gt: user[0].readTime,
              },
            },
          });
          return messages.length;
        } catch (e) {
          console.log(e);
          return 'Error';
        }
      }
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async readMessages(userId: number, conversationId: number) {
    try {
      await this.prisma.conversationsUsers.updateMany({
        where: {
          userId: userId,
          conversationId: conversationId,
        },
        data: {
          readTime: new Date(),
        },
      });
      return 'Messages read';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
  public async updateConversationName(
    userId: number,
    conversationId: number,
    name: string,
  ) {
    try {
      if (!(await this.isAdmin(userId, conversationId))) {
        return 'You are not admin';
      }
      await this.prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          name: name,
        },
      });
      return 'Conversation name updated';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
  private async isAdmin(userId: number, conversationId: number) {
    const user = await this.prisma.conversationsUsers.findMany({
      where: {
        userId: userId,
        conversationId: conversationId,
        isAdmin: true,
      },
    });
    return user.length > 0;
  }
}
