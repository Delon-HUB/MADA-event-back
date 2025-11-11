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
import * as qrcode from 'qrcode';
import { join } from 'path';
import { TicketService } from '../ticket/ticket.service';
import { ICreateEventDto } from '../event/dto/create-event.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly paymentService: PaymentService,
    private readonly ticketService: TicketService,
  ) {}

  @Post()
  async create(@Body() paymentDto: ICreatePaymentDto, @Request() req: Req) {
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new UnauthorizedException(EError.TOKEN_INVALID);
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'fdsafkjfkjdsafljwlkjfl',
      });
      if (!payload.sub) throw new UnauthorizedException(EError.TOKEN_EXPIRED);

      const ticket = await this.ticketService.findOne(
        paymentDto.ticketId! as string,
      );
      if (!ticket) throw new NotFoundException('TICKET_NOT_FOUND');

      // create payment
      const amount =
        (ticket.eventId as ICreateEventDto).price *
        (ticket.nbChild * 0.5 + ticket.nbAdult * 1 + ticket.nbSenior * 0.8);
      paymentDto.userId = payload.sub as string;
      paymentDto.ticketId = ticket._id!;
      paymentDto.amount = amount;
      paymentDto.status = 'PAID';
      let payment = await this.paymentService.create(paymentDto);

      // qrcode
      const path =
        join(__dirname, '..', '..', '..', 'public/', 'qrcode/') +
        'ticket-' +
        Date.now() +
        '.png';
      const qrCodeData = {
        paymentId: payment!._id,
        child: ticket.nbChild,
        adult: ticket.nbAdult,
        senior: ticket.nbSenior,
        amount: amount,
      };
      await qrcode.toFile(path, JSON.stringify(qrCodeData));

      // notification
      return payment;
    } catch (error) {
      console.error(error);
    }
  }

  private extractTokenFromHeader(request: Req): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
