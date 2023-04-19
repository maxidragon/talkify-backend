import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class WebsocketModule {}
