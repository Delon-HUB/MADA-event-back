import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { type ICreatePaymentDto } from './dto/create-payment.dto';
import { EError } from '../../Enums/EError';
import type { Request as Req } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly paymentService: PaymentService,
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

      data.userId = payload.sub;
      const newPayment = await this.paymentService.create(data);
      // this.eventGateway.newEventCreated(newEvent);
      return newPayment;
    } catch (error) {
      console.error(error);
    }
  }

  private extractTokenFromHeader(request: Req): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
