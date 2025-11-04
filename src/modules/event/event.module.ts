import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventGateway } from './event.gateway';
import { EventEntity, EventSchema } from './entities/event.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventSchema },
    ]),
    JwtModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventGateway],
})
export class EventModule {}
