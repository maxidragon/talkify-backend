import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { SendDto } from './dto/send.dto';
import { EditDto } from './dto/edit.dto';
import { ConversationService } from '../conversation/conversation.service';
import { ChatGateway } from '../chat/chat.gateway';

@UseGuards(AuthGuard('jwt'))
@Controller('message')
export class MessageController {
  constructor(
    private messageService: MessageService,
    private chatGateway: ChatGateway,
    private conversationService: ConversationService,
  ) {}

  @Post('send')
  async sendMessage(@Body() dto: SendDto, @GetUser() user: JwtAuthDto) {
    const users = await this.conversationService.getConversationMembers(
      user.userId,
      dto.conversation,
    );
    const sender = users.find((u) => u.user.id === user.userId);
    const result = await this.messageService.sendMessage(
      dto.content,
      user.userId,
      dto.conversation,
    );
    this.chatGateway.handleMessage({
      conversationId: dto.conversation,
      message: this.convertBigIntToString({
        id: result.id,
        content: result.content,
        sendTime: result.sendTime,
        isEdited: result.isEdited,
        sender: {
          id: user.userId,
          username: sender.user.username,
        },
      }),
    });
  }

  @Put(':messageId')
  async editMessage(
    @GetUser() user: JwtAuthDto,
    @Body() dto: EditDto,
    @Param('messageId') messageId: string,
  ) {
    return await this.messageService.editMessage(
      user.userId,
      +messageId,
      dto.content,
    );
  }

  @Delete('delete/:messageId')
  async deleteMessage(
    @GetUser() user: JwtAuthDto,
    @Param('messageId') messageId: string,
  ) {
    return await this.messageService.deleteMessage(user.userId, +messageId);
  }

  @Get('search/:conversationId')
  async searchMessages(
    @GetUser() user: JwtAuthDto,
    @Param('conversationId') conversationId: string,
    @Query('content') content: string,
  ) {
    return await this.messageService.searchMessages(
      user.userId,
      +conversationId,
      content,
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
