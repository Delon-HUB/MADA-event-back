import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketEntity, TicketSchema } from './entities/ticket.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { EventSchema } from '../event/entities/event.entity';
import { EventModule } from '../event/event.module';
import { EventService } from '../event/event.service';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: TicketEntity.name, schema: TicketSchema },
      { name: 'events', schema: EventSchema },
    ]),
    EventModule,
  ],
  controllers: [TicketController],
  providers: [TicketService, EventService],
  exports: [MongooseModule],
})
export class TicketModule {}
