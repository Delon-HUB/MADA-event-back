import { Injectable, NotFoundException } from '@nestjs/common';
import { IEvent } from './dto/create-event.dto';
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

  async create(createEventDto: IEvent): Promise<IEvent> {
    createEventDto.ticketAvailable = createEventDto.capacity;
    const newEvent = (
      await this.eventModel.create({
        ...createEventDto,
        ownerId: createEventDto.ownerId.toString(),
      })
    ).toObject();
    return (await this.findById(newEvent._id.toString())) as IEvent;
  }

  async findAll(): Promise<IEvent[]> {
    const eventsEntities = await this.eventModel
      .find()
      .sort({ cratedAt: -1 })
      .exec();
    const events: IEvent[] = eventsEntities.map((ev) => {
      const event = ev.toJSON();
      return {
        ...event,
        _id: event._id.toString(),
        ownerId: event.ownerId.toString(),
        capacity: event.capacity!,
      };
    });
    return events;
  }

  async findById(id: string): Promise<IEvent | null> {
    const event = await this.eventModel.findById(id).exec();
    const eventJson = event?.toJSON();
    return event != null
      ? ({
          ...eventJson,
          _id: eventJson!._id.toString(),
          ownerId: eventJson!.ownerId.toString(),
        } as IEvent)
      : null;
  }

  async findByOwnerId(userId: string): Promise<IEvent[]> {
    const eventsEntities = await this.eventModel
      .find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .exec();
    const events: IEvent[] = eventsEntities.map((ev) => {
      const event = ev.toJSON();
      return {
        ...event,
        _id: event._id.toString(),
        ownerId: event.ownerId.toString(),
        capacity: event.capacity!,
      };
    });
    return events;
  }

  async update(
    id: string,
    updateEventDto: Partial<IEvent>,
  ): Promise<IEvent | null> {
    const event = await this.findById(id);
    if (!event) throw new NotFoundException(EError.EVENT_NOT_FOUND);
    await this.eventModel.findByIdAndUpdate(id, updateEventDto).lean().exec();
    return this.findById(id);
  }

  async findOne(id: string) {
    return this.eventModel.findById(id).populate({ path: 'ownerId' }).exec();
  }

  async findByUserId(userId: string): Promise<ICreateEventDto[]> {
    const objectIdOwner = new Types.ObjectId(userId);

    const eventsEntities = await this.eventModel
      .find({ ownerId: objectIdOwner })
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
