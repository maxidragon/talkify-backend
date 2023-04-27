import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

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
}
