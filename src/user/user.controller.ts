import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('search/:query')
  async searchUser(@Param('query') query: string) {
    return await this.userService.searchUser(query);
  }

  @Get('settings')
  async getSettings(@GetUser() user: JwtAuthDto) {
    return await this.userService.getSettings(user.userId);
  }

  @Put('settings')
  async updateSettings(@GetUser() user: JwtAuthDto, @Body() settings: any) {
    return await this.userService.updateSettings(user.userId, settings);
  }
}
