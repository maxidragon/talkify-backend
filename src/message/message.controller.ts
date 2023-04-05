import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { GetUser } from '../auth/decorator/getUser.decorator';

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
}
