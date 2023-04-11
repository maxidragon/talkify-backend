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
    @Param('conversationId') conversationId: number,
    @GetUser() user: JwtAuthDto,
  ) {
    return await this.messageService.getConversation(
      user.userId,
      conversationId,
    );
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
      dto.receiver,
    );
  }

  @Delete('delete/:messageId')
  async deleteMessage(
    @GetUser() user: JwtAuthDto,
    @Param('messageId') messageId: number,
  ) {
    return await this.messageService.deleteMessage(user.userId, messageId);
  }
}
