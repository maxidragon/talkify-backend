import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { ConversationService } from './conversation.service';
import { AuthGuard } from '@nestjs/passport';
import { AddUserDto } from './dto/addUser.dto';
import { CreateConversationDto } from './dto/createConversation.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get(':conversationId')
  async getConversation(
    @Param('conversationId') conversationId: string,
    @Query('skip') skip = '0',
    @Query('take') take = '10',
    @GetUser() user: JwtAuthDto,
  ) {
    if (isNaN(+conversationId)) {
      return [];
    }
    const conversation = await this.conversationService.getConversation(
      user.userId,
      parseInt(conversationId),
      parseInt(skip),
      parseInt(take),
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

  @Post('add')
  async addConversationMember(
    @Body() body: AddUserDto,
    @GetUser() user: JwtAuthDto,
  ) {
    console.log(body);
    await this.conversationService.addConversationMember(body, user.userId);
    return { body, statusCode: 201 };
  }

  @Get('accept/:conversationId')
  async acceptInvitation(
    @Param('conversationId') conversationId: string,
    @GetUser() user: JwtAuthDto,
  ) {
    await this.conversationService.acceptInvitation(
      +conversationId,
      user.userId,
    );
    return { statusCode: 201 };
  }
  @Get('invitations')
  async getInvitations(@GetUser() user: JwtAuthDto) {
    console.log(user.userId);
    return this.conversationService.getUserInvitations(user.userId);
  }
  @Get('invitations/number')
  async getNumberOfInvitations(@GetUser() user: JwtAuthDto) {
    return this.conversationService.getNumberOfInvitations(user.userId);
  }
  @Delete('leave/:conversationId')
  async leaveConversation(
    @GetUser() user: JwtAuthDto,
    @Param('conversationId') conversationId: string,
  ) {
    await this.conversationService.removeUserFromConversation(
      user.userId,
      parseInt(conversationId),
    );
    return { statusCode: 204 };
  }

  @Post('create')
  async createConversation(
    @Body() body: CreateConversationDto,
    @GetUser() user: JwtAuthDto,
  ) {
    await this.conversationService.createConversation(user.userId, body.name);
    return { statusCode: 201 };
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
