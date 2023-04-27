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

@UseGuards(AuthGuard('jwt'))
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('send')
  async sendMessage(@Body() dto: SendDto, @GetUser() user: JwtAuthDto) {
    return await this.messageService.sendMessage(
      dto.content,
      user.userId,
      dto.conversation,
    );
  }

  @Put('edit/')
  async editMessage(@GetUser() user: JwtAuthDto, @Body() dto: EditDto) {
    return await this.messageService.editMessage(
      user.userId,
      dto.message,
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
}
