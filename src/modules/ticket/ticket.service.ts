import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateTicketDto } from './dto/create-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketEntity } from './entities/ticket.entity';
import { EventService } from '../event/event.service';
import { EError } from '../../Enums/EError';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(TicketEntity.name)
    private readonly ticketModel: Model<TicketEntity>,
    private readonly eventService: EventService,
  ) {}

  async create(createTicketDto: ICreateTicketDto): Promise<ICreateTicketDto> {
    const event = await this.eventService.findOne(
      createTicketDto.eventId as string,
    );
    if (!event) throw new NotFoundException(EError.EVENT_NOT_FOUND);

    if (event.capacity && event.participants?.length >= event.capacity)
      throw new BadRequestException(EError.EVENT_CAPACITY_EXCEEDED);
    await this.eventService.update(event._id!, {
      participants: [
        ...(event.participants as string[]),
        createTicketDto.userId as string,
      ],
    });
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
