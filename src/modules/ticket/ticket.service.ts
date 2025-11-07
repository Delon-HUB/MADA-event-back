import { Injectable } from '@nestjs/common';
import { ICreateTicketDto } from './dto/create-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findByUserId(userId: string): Promise<ICreateTicketDto[]> {
    const ticketEntites = await this.ticketModel
      .find({ userId: userId })
      .populate({ path: 'eventId' })
      .exec();
    const tickets: ICreateTicketDto[] = ticketEntites.map((t) => {
      const ticket = t.toObject();
      return {
        ...ticket,
        _id: ticket._id.toString(),
        userId: ticket.userId.toString(),
      };
    });
    return tickets;
  }

  async findByEventId(eventId: string) {
    const ticketEntities = await this.ticketModel
      .find({ eventId: eventId })
      .populate({ path: 'userId' })
      .exec();

    const tickets: ICreateTicketDto[] = ticketEntities.map((t) => {
      const ticket = t.toObject();
      return {
        ...ticket,
        _id: ticket._id.toString(),
      };
    });
    return tickets;
  }
}
