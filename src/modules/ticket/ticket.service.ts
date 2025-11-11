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

    return {
      ...newTicket,
      _id: newTicket._id.toString(),
    };
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

  async findOne(ticketId: string): Promise<ICreateTicketDto | null> {
    const ticketEntity = await this.ticketModel
      .findById(ticketId)
      .populate({ path: 'userId' })
      .populate({ path: 'eventId' })
      .lean()
      .exec();
    if (!ticketEntity) return null;

    return {
      ...ticketEntity,
      _id: ticketEntity._id.toString(),
      userId: ticketEntity.userId,
      eventId: ticketEntity.eventId,
    };
  }
}
