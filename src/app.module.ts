import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConversationModule } from './conversation/conversation.module';
import { WebsocketModule } from './chat/chat.module';

@Module({
  imports: [
    DbModule,
    MessageModule,
    AuthModule,
    UserModule,
    ConversationModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
