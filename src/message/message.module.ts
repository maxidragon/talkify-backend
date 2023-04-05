import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
