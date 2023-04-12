import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { SendDto } from './dto/send.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('conversation/:conversationId')
  async getConversation(
    @Param('conversationId') conversationId: string,
    @GetUser() user: JwtAuthDto,
  ) {
    const conversation = await this.messageService.getConversation(
      user.userId,
      parseInt(conversationId),
    );
    return this.convertBigIntToString(conversation);
  }

  @Get('conversations')
  async getUserConversations(@GetUser() user: JwtAuthDto) {
    console.log(user);
    return await this.messageService.getUserConversations(user.userId);
  }

  @Post('send')
  async sendMessage(@Body() dto: SendDto, @GetUser() user: JwtAuthDto) {
    return await this.messageService.sendMessage(
      dto.content,
      user.userId,
      dto.conversation,
    );
  }

  @Delete('delete/:messageId')
  async deleteMessage(
    @GetUser() user: JwtAuthDto,
    @Param('messageId') messageId: number,
  ) {
    return await this.messageService.deleteMessage(user.userId, messageId);
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
