import {
  Controller,
  Post,
  Body,
  Request,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { type ICreateTicketDto } from './dto/create-ticket.dto';
import { type Request as Req } from 'express';
import { EError } from '../../Enums/EError';
import { JwtService } from '@nestjs/jwt';
import { EventService } from '../event/event.service';

@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly jwtService: JwtService,
    private readonly eventService: EventService,
  ) {}

  @Post()
  async create(@Body() createTicketDto: ICreateTicketDto) {
    const event = await this.eventService.findById(
      createTicketDto.eventId as string,
    );
    if (!event) throw new NotFoundException(EError.EVENT_NOT_FOUND);
    const nbTicket =
      createTicketDto.nbAdult +
      createTicketDto.nbChild +
      createTicketDto.nbSenior;

    const isFree = !!event.capacity;
    const isExceeded =
      event.ticketAvailable != undefined &&
      event.ticketAvailable - nbTicket < 0;
    if (!isFree && isExceeded)
      throw new BadRequestException(EError.EVENT_CAPACITY_EXCEEDED);

    const ticket = await this.ticketService.create(createTicketDto);
    if (!isFree)
      await this.eventService.update(event._id!, {
        ticketAvailable: event.ticketAvailable! - nbTicket,
      });
    return ticket;
  }

  @Post('mine')
  async finByUserId(@Request() req: Req) {
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new UnauthorizedException(EError.TOKEN_INVALID);
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'fdsafkjfkjdsafljwlkjfl',
      });
      if (!payload.sub) throw new UnauthorizedException(EError.TOKEN_EXPIRED);

      const userId = payload.sub;
      const tickets = await this.ticketService.findByUserId(userId);
      return tickets;
    } catch (error) {
      console.error(error);
    }
  }

  @Post('event')
  async findTicketForEvent(@Body('eventId') eventId: string) {
    const result = await this.ticketService.findByEventId(eventId);
    return result;
  }

  private extractTokenFromHeader(request: Req): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
