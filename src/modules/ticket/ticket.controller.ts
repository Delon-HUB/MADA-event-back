import { Controller, Get, Post, Body } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { type ICreateTicketDto } from './dto/create-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Body() createTicketDto: ICreateTicketDto) {
    return this.ticketService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }
}
