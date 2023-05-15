import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GetUser } from './decorator/getUser.decorator';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('isTaken')
  async isTaken(@Query('email') email: string) {
    return await this.authService.isTaken(email);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    res.clearCookie('user_info');
    res.send({ statusCode: true, message: 'Logout success' });
  }
  @Get('verify/:tempId')
  async verify(@Param('tempId') tempId: string) {
    await this.authService.verifyUser(tempId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('changePassword')
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @GetUser() user: JwtAuthDto,
  ) {
    await this.authService.changePassword(
      user.userId,
      dto.oldPassword,
      dto.newPassword,
    );
  }
}
