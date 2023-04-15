import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { ConversationService } from './conversation.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get(':conversationId')
  async getConversation(
    @Param('conversationId') conversationId: string,
    @GetUser() user: JwtAuthDto,
  ) {
    const conversation = await this.conversationService.getConversation(
      user.userId,
      parseInt(conversationId),
    );
    return this.convertBigIntToString(conversation);
  }

  @Get('')
  async getUserConversations(@GetUser() user: JwtAuthDto) {
    console.log(user);
    return await this.conversationService.getUserConversations(user.userId);
  }

  @Get(':conversationId/members')
  async getConversationMembers(
    @GetUser() user: JwtAuthDto,
    @Param('conversationId') conversationId: string,
  ) {
    return await this.conversationService.getConversationMembers(
      user.userId,
      parseInt(conversationId),
    );
  }

  convertBigIntToString(obj: any): any {
    if (obj instanceof Object) {
      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          obj[prop] = this.convertBigIntToString(obj[prop]);
        }
      }
    } else if (typeof obj === 'bigint') {
      obj = obj.toString();
    }
    return obj;
  }
}
