import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { SendDto } from './dto/send.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('conversation/:receiverId')
  async getConversation(
    @Param('receiverId') receiverId: number,
    @GetUser() user: JwtAuthDto,
  ) {
    return await this.messageService.getConversation(user.userId, receiverId);
  }

  @Post('send')
  async sendMessage(@Body() dto: SendDto, @GetUser() user: JwtAuthDto) {
    return await this.messageService.sendMessage(
      dto.content,
      user.userId,
      dto.receiver,
    );
  }

  @Get('unread/:receiverId')
  async getNumberOfUnreadMessages(
    @GetUser() user: JwtAuthDto,
    @Param('receiverId') receiverId: number,
  ) {
    return await this.messageService.getNumberOfUnreadMessages(
      user.userId,
      receiverId,
    );
  }

  @Get('markAsRead/:receiverId')
  async markAsRead(
    @GetUser() user: JwtAuthDto,
    @Param('receiverId') receiverId: number,
  ) {
    return await this.messageService.markAsRead(user.userId, receiverId);
  }
}
