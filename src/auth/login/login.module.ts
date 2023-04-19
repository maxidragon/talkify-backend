import { forwardRef, Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { AuthModule } from '../auth.module';
import { WebsocketModule } from '../../chat/chat.module';

@Module({
  imports: [forwardRef(() => AuthModule), WebsocketModule],
  controllers: [LoginController],
})
export class LoginModule {}
