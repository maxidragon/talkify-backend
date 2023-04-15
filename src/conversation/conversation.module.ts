import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
