import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventGateway } from './event.gateway';

@Module({
  controllers: [EventController],
  providers: [EventService, EventGateway],
})
export class EventModule {}
