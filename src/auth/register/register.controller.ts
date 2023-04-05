import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../auth.service';

@Controller('auth/register')
export class RegisterController {
  constructor(private authService: AuthService) {}

  @Post()
  async register(@Body() dto: RegisterDto): Promise<object> {
    return this.authService.signup(dto);
  }
}
