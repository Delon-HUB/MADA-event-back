import { Injectable, NotFoundException } from '@nestjs/common';
import { ICreateEventDto } from './dto/create-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEntity } from './entities/event.entity';
import { EError } from '../../Enums/EError';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventEntity.name)
    private readonly eventModel: Model<EventEntity>,
  ) {}

  async create(createEventDto: ICreateEventDto): Promise<ICreateEventDto> {
    createEventDto.ticketAvailable = createEventDto.capacity;
    const newEvent = (await this.eventModel.create(createEventDto)).toObject();
    return (await this.findById(newEvent._id.toString())) as ICreateEventDto;
  }

  async findAll(): Promise<ICreateEventDto[]> {
    const eventsEntities = await this.eventModel
      .find()
      .sort({ cratedAt: -1 })
      .exec();
    const events: ICreateEventDto[] = eventsEntities.map((ev) => {
      const event = ev.toJSON();
      return {
        ...event,
        _id: event._id.toString(),
        ownerId: event.ownerId.toString(),
      };
    });
    return events;
  }

  async findById(id: string): Promise<ICreateEventDto | null> {
    const event = await this.eventModel.findById(id).exec();
    const eventJson = event?.toJSON();
    return event != null
      ? ({
          ...eventJson,
          _id: eventJson!._id.toString(),
          ownerId: eventJson!.ownerId.toString(),
        } as ICreateEventDto)
      : null;
  }

  async findByOwnerId(userId: string): Promise<ICreateEventDto[]> {
    const objectIdOwner = new Types.ObjectId(userId);

    const eventsEntities = await this.eventModel
      .find({ ownerId: objectIdOwner })
      .sort({ createdAt: -1 })
      .exec();
    const events: ICreateEventDto[] = eventsEntities.map((ev) => {
      const event = ev.toJSON();
      return {
        ...event,
        _id: event._id.toString(),
        ownerId: event.ownerId.toString(),
      };
    });
    return events;
  }

  async update(
    id: string,
    updateEventDto: Partial<ICreateEventDto>,
  ): Promise<ICreateEventDto | null> {
    const event = await this.findById(id);
    if (!event) throw new NotFoundException(EError.EVENT_NOT_FOUND);
    await this.eventModel.findByIdAndUpdate(id, updateEventDto).lean().exec();
    return this.findById(id);
  }
}
