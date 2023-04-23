import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DbService) {}

  public async searchUser(search: string): Promise<any> {
    try {
      return await this.prisma.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: search,
              },
            },
          ],
        },
        select: {
          id: true,
          username: true,
        },
      });
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async getSettings(userId: number): Promise<any> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          username: true,
          email: true,
        },
      });
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }

  public async updateSettings(userId: number, settings: any): Promise<any> {
    try {
      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username: settings.username,
          email: settings.email,
        },
      });
    } catch (e) {
      console.log(e);
      return 'Error';
    }
  }
}
