import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentEntity, PaymentSchema } from './entities/payment.entity';
import { JwtModule } from '@nestjs/jwt';
import { EventModule } from '../event/event.module';
import { EventService } from '../event/event.service';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { UserModule } from '../user/user.module';
import { EventEntity, EventSchema } from '../event/entities/event.entity';
import { UserSchema } from '../user/entities/user.entity';
import { TicketModule } from '../ticket/ticket.module';
import { TicketService } from '../ticket/ticket.service';
import { TicketEntity, TicketSchema } from '../ticket/entities/ticket.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentEntity.name, schema: PaymentSchema },
      { name: EventEntity.name, schema: EventSchema },
      { name: 'users', schema: UserSchema },
      { name: 'tickets', schema: TicketSchema },
    ]),
    TicketModule,
    JwtModule,
    EventModule,
    MailModule,
    UserModule,
    TicketModule,
    NotificationModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, EventService, MailService, TicketService],
  exports: [MongooseModule],
})
export class PaymentModule {}
