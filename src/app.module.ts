import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [DbModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
