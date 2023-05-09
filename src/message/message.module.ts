import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { DbModule } from '../db/db.module';
import { ConversationModule } from '../conversation/conversation.module';
import { ChatModule } from '../chat/chat.module';
import { ChatGateway } from '../chat/chat.gateway';
import { ConversationService } from '../conversation/conversation.service';

@Module({
  imports: [DbModule, ConversationModule, ChatModule],
  controllers: [MessageController],
  providers: [MessageService, ChatGateway, ConversationService],
})
export class MessageModule {}
