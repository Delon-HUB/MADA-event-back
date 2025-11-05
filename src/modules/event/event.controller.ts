import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  Request,
  Param,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { EventService } from './event.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ICreateEventDto } from './dto/create-event.dto';
import { diskStorage } from 'multer';
import { NotificationGateway } from '../notification/notification.gateway';
import type { Request as Req } from 'express';
import { EError } from '../../Enums/EError';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../../interfaces/IJwtPayload';
import { ERole } from '../../Enums/ERole';
import { EventStatus, PaymentStatus } from '../../Enums/EStatus';
import { PaymentService } from '../payment/payment.service';
import { TicketService } from '../ticket/ticket.service';
import { ICreatePaymentDto } from '../payment/dto/create-payment.dto';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly jwtService: JwtService,
    private readonly notificationGateway: NotificationGateway,
    private readonly ticketService: TicketService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/event',
        filename: (req, file, cb) => {
          const filename =
            'event-' + Date.now() + `.${file.mimetype.split('/')[1]}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() img: Express.Multer.File,
    @Body() data: ICreateEventDto,
    @Request() req: Req,
  ) {
    const payload = this.getPayload(req);
    data.ownerId = payload.sub;
    if (img) data.photo = img.path;
    const newEvent = await this.eventService.create(data);
    this.notificationGateway.newEventCreated(newEvent);
    return newEvent;
  }

  @Get()
  async findAll(@Request() req: Req) {
    const payload = this.getPayload(req);
    if (payload.role == ERole.ORGANIZER)
      return await this.eventService.findByOwnerId(payload.sub);
    else if (payload.role == ERole.CLIENT) {
      const all = await this.eventService.findAll();
      return all.filter(
        (e) =>
          e.status == EventStatus.UPCOMING || e.status == EventStatus.ONGOING,
      );
    } else return await this.eventService.findAll();
  }

  @Get(':eventId')
  async getById(@Param('eventId') eventId: string) {
    return await this.eventService.findById(eventId);
  }

  @Post('/mine')
  async getByUserId(@Request() req: Req) {
    const payload = this.getPayload(req);
    if (payload?.sub) return await this.eventService.findByOwnerId(payload.sub);
  }

  @Patch(':id')
  async cancelEvent(@Param('id') eventId: string) {
    const event = await this.eventService.findById(eventId);
    if (!event) throw new NotFoundException(EError.EVENT_NOT_FOUND);
    const eventCanceled = await this.eventService.update(eventId, {
      cancelled: true,
    });
    const tickets = await this.ticketService.findByEventId(eventId);

    await Promise.all(
      tickets.map(async (ticket) => {
        const payments = await this.paymentService.findByTicketId(ticket._id!);
        // chaque payment: update paymentStatus && notifier le client qu'il est remboursé (payment)
        await Promise.all(
          payments.map(async (p: ICreatePaymentDto) => {
            const refundedPay = await this.paymentService.update(p._id!, {
              refundedAmount: p.amount,
              status: PaymentStatus.REFUNDED,
            });
            // update ticketAvailable
            const eventUpdated = await this.eventService.update(
              eventCanceled!._id!,
              {
                ticketAvailable:
                  eventCanceled!.ticketAvailable! +
                  (ticket.nbAdult + ticket.nbChild + ticket.nbChild),
              },
            );
            this.notificationGateway.eventUpdated(eventUpdated!);
            // notification client
            refundedPay!.ticketId = ticket;
            refundedPay!.ticketId.eventId = eventCanceled!;
            await this.notificationGateway.paymentRefunded(refundedPay!);
          }),
        );
      }),
    );
    // notifier organisateur
    await this.notificationGateway.eventCancelled(eventCanceled!);
    return eventCanceled;
  }

  private getPayload(request: Req): IJwtPayload {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (!(type && token)) throw new UnauthorizedException(EError.TOKEN_INVALID);
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET || 'fdsafkjfkjdsafljwlkjfl',
    });
    if (!payload.sub) throw new UnauthorizedException(EError.TOKEN_EXPIRED);
    return payload;
  }

  @Get('hello')
  sayHello() {
    return 'hello';
  }

  @Post('/mine')
  async getByUserId(@Request() req: Req) {
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new UnauthorizedException(EError.TOKEN_INVALID);
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'fdsafkjfkjdsafljwlkjfl',
      });
      if (!payload.sub) throw new UnauthorizedException(EError.TOKEN_EXPIRED);
      return await this.eventService.findByUserId(payload.sub);
    } catch (error) {
      console.error(error);
    }
  }

  private extractTokenFromHeader(request: Req): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
