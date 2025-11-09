import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { type ICreatePaymentDto } from './dto/create-payment.dto';
import { EError } from '../../Enums/EError';
import type { Request as Req } from 'express';
import { JwtService } from '@nestjs/jwt';
import { EventService } from '../event/event.service';
import * as qrcode from 'qrcode';
import { MailService } from '../mail/mail.service';
import { join } from 'path';
import { TicketService } from '../ticket/ticket.service';
import { ICreateTicketDto } from '../ticket/dto/create-ticket.dto';
import { NotificationGateway } from '../notification/notification.gateway';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly paymentService: PaymentService,
    private readonly eventService: EventService,
    private readonly mailService: MailService,
    private readonly ticketService: TicketService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @Post()
  async create(@Body() data: ICreatePaymentDto, @Request() req: Req) {
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new UnauthorizedException(EError.TOKEN_INVALID);
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'fdsafkjfkjdsafljwlkjfl',
      });
      if (!payload.sub) throw new UnauthorizedException(EError.TOKEN_EXPIRED);

      const event = await this.eventService.findOne(data.eventId!);
      if (!event) throw new NotFoundException('EVENT_NOT_FOUND');
      data.userId = payload.sub;

      // qrcode
      const rootPath = join(__dirname, '..', '..', '..', 'public/', 'qrcode/');
      const fileName = 'ticket-' + Date.now() + '.png';
      await qrcode.toFile(rootPath + fileName, event._id!.toString());

      // create ticket
      const ticket: ICreateTicketDto = {
        userId: data.userId,
        eventId: event._id!.toString(),
        price: event.price,
        paymentStatus: 'PAID',
        qrCodeUrl: 'public/qrcode/' + fileName,
      };
      const ticketCreated = await this.ticketService.create(ticket);

      // create payment
      data.ticketId = ticketCreated._id;
      await this.paymentService.create(data);
      ticketCreated.eventId = event;

      this.notificationGateway.newTicketPaid(
        ticketCreated.userId as string,
        event.ownerId as string,
        ticketCreated,
      );
      return ticketCreated;
    } catch (error) {
      console.error(error);
    }
  }

  private extractTokenFromHeader(request: Req): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
