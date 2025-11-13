import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventEntity, EventSchema } from './entities/event.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';
import { PaymentModule } from '../payment/payment.module';
import { PaymentService } from '../payment/payment.service';
import { TicketModule } from '../ticket/ticket.module';
import { TicketService } from '../ticket/ticket.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventSchema },
    ]),
    JwtModule,
    NotificationModule,
    forwardRef(() => PaymentModule),
    forwardRef(() => TicketModule),
  ],
  controllers: [EventController],
  providers: [EventService, TicketService, PaymentService, JwtService],
  exports: [MongooseModule],
})
export class EventModule {}
