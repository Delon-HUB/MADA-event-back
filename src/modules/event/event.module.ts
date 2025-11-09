import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventEntity, EventSchema } from './entities/event.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventSchema },
    ]),
    JwtModule,
    NotificationModule,
  ],
  controllers: [EventController],
  providers: [EventService, JwtService],
  exports: [MongooseModule],
})
export class EventModule {}
