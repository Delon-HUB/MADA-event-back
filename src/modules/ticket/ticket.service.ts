import { Injectable } from '@nestjs/common';
import { ICreateTicketDto } from './dto/create-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketEntity } from './entities/ticket.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(TicketEntity.name)
    private readonly ticketModel: Model<TicketEntity>,
  ) {}

  async create(createTicketDto: ICreateTicketDto): Promise<ICreateTicketDto> {
    const newTicket = (
      await this.ticketModel.create(createTicketDto)
    ).toObject();

    const created = {
      ...newTicket,
      _id: newTicket._id.toString(),
      eventId: newTicket.eventId.toString(),
      userId: newTicket.userId.toString(),
    } as ICreateTicketDto;

    return created;
  }

  findAll() {
    return `This action returns all ticket`;
  }
}
