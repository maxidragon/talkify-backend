import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('isTaken')
  async isTaken(@Query('email') email: string) {
    return await this.authService.isTaken(email);
  }
}
