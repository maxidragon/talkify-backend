/* eslint-disable */
import {Injectable} from '@nestjs/common';
import {DbService} from '../db/db.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: DbService) {}
  public async sendMessage(
    content: string,
    senderId: number,
    receiverId: number,
  ): Promise<string> {
    try {
      await this.prisma.message.create({
        data: {
          content: content,
          senderId: senderId,
          receiverId: receiverId,
        },
      });
      return 'Message sent';
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
  public async getConversation(
    senderId: number,
    receiverId: number,
  ): Promise<any> {
    try {
        return await this.prisma.message.findMany({
          where: {
              OR: [
                  {
                      senderId: senderId,
                      receiverId: receiverId,
                  },
                  {
                      senderId: receiverId,
                      receiverId: senderId,
                  },
              ],
          },
      });
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
}
