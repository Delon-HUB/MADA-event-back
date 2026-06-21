import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Request,
  NotFoundException,
  Get,
  Param,
  HttpException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { type ICreatePaymentDto } from './dto/create-payment.dto';
import { EError } from '../../Enums/EError';
import type { Request as Req } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as qrcode from 'qrcode';
import { join } from 'path';
import { TicketService } from '../ticket/ticket.service';
import { IEvent } from '../event/dto/create-event.dto';
import { NotificationGateway } from '../notification/notification.gateway';
import { EventStatus, PaymentStatus } from '../../Enums/EStatus';
import { ICreateTicketDto } from '../ticket/dto/create-ticket.dto';
import { EventService } from '../event/event.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly paymentService: PaymentService,
    private readonly ticketService: TicketService,
    private readonly notificationGateway: NotificationGateway,
    private readonly eventService: EventService,
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
      if (!ticket) throw new NotFoundException(EError.TICKET_NOT_FOUND);

      // create payment
      const amount = parseFloat(
        (
          (ticket.eventId as IEvent).price *
          (ticket.nbChild * 0.5 + ticket.nbAdult * 1 + ticket.nbSenior * 0.8)
        ).toFixed(2),
      );
      paymentDto.userId = payload.sub as string;
      paymentDto.ticketId = ticket._id!;
      paymentDto.amount = amount;
      paymentDto.status = PaymentStatus.PAID;
      let payment = await this.paymentService.create(paymentDto);

      // qrcode
      const path = join('public/', 'qrcode/') + 'ticket-' + Date.now() + '.png';

      const qrCodeData = {
        paymentId: payment!._id,
        child: ticket.nbChild,
        adult: ticket.nbAdult,
        senior: ticket.nbSenior,
        amount: amount,
      };
      await qrcode.toFile(path, JSON.stringify(qrCodeData));

      payment = await this.paymentService.update(payment?._id!, {
        qrCodeUrl: path,
      });
      payment!.ticketId = ticket;
      // notification
      await this.notificationGateway.newTicketPaid(payment!);
      return payment;
    } catch (error) {
      console.error(error);
    }
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    const payments = await this.paymentService.findByUserId(userId);
    return payments;
  }

  @Get('ticket/:ticketId')
  async getByTicketId(@Param('ticketId') ticketId: string) {
    const payments = await this.paymentService.findByTicketId(ticketId);
    return payments;
  }

  @Post('refund/accept/')
  async reqRefund(@Body('paymentId') paymentId: string) {
    const res = await this.getRefundAmount(paymentId);

    const refundedPay = await this.paymentService.update(paymentId, {
      refundedAmount: res.allowedAmount,
      status: PaymentStatus.REFUNDED,
    });
    const ticket = await this.ticketService.findOne(
      refundedPay!.ticketId as string,
    );
    // update ticketAvailable
    const eventUpdated = await this.eventService.update(
      (ticket?.eventId as IEvent)!._id!,
      {
        ticketAvailable:
          (ticket?.eventId as IEvent).ticketAvailable! +
          (ticket!.nbAdult + ticket!.nbChild + ticket!.nbSenior),
      },
    );
    await this.notificationGateway.eventUpdated(eventUpdated!);
    // // notification client
    refundedPay!.ticketId = ticket!;
    refundedPay!.ticketId.eventId = eventUpdated!;
    await this.notificationGateway.paymentRefunded(refundedPay!);
    return refundedPay;
  }

  @Get('refund/:paymentId')
  async getRefundAmount(@Param('paymentId') paymentId: string) {
    const payment = await this.paymentService.findById(paymentId, true);
    if (!payment) throw new NotFoundException(EError.PAYMENT_NOT_FOUND);
    const ticket = payment.ticketId as ICreateTicketDto;
    const event = await this.eventService.findById(ticket.eventId as string);
    if (!event) throw new NotFoundException(EError.EVENT_NOT_FOUND);
    if (event.status != EventStatus.UPCOMING)
      throw new HttpException(EError.PAYMENT_REFUND_NOT_ALLOWED, 400);
    const allowedAmount = this.calculateRefund(
      event.startDate,
      new Date(),
      payment.amount,
    );
    if (!allowedAmount) throw new HttpException(EError.PAYMENT_REFUND_NOT_ALLOWED, 400);

    return { paymentId: payment._id, allowedAmount: allowedAmount };
  }

  private calculateRefund(
    eventDate: Date,
    requestDate: Date,
    price: number,
  ): number {
    const oneDay = 1000 * 60 * 60 * 24;

    const diffDays = Math.ceil(
      (eventDate.getTime() - requestDate.getTime()) / oneDay,
    );
    if (diffDays > 5) return price;
    switch (diffDays) {
      case 5:
        return price * 0.8;
      case 4:
        return price * 0.6;
      case 3:
        return price * 0.4;
      case 2:
        return price * 0.2;
      default:
        return 0;
    }
  }

  private extractTokenFromHeader(request: Req): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
