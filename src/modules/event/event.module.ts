import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventGateway } from './event.gateway';
import { EventEntity, EventSchema } from './entities/event.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, EventGateway],
})
export class EventModule {}
