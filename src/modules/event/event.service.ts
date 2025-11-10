import { Injectable } from '@nestjs/common';
import { ICreateEventDto } from './dto/create-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(EventEntity.name)
    private readonly eventModel: Model<EventEntity>,
  ) {}

  async create(createEventDto: ICreateEventDto): Promise<ICreateEventDto> {
    const newEvent = (await this.eventModel.create(createEventDto)).toObject();
    return {
      ...newEvent,
      _id: newEvent._id.toString(),
      ownerId: newEvent.ownerId.toString(),
    };
  }

  async findAll(): Promise<ICreateEventDto[]> {
    const eventsEntities = await this.eventModel.find().exec();
    const events: ICreateEventDto[] = eventsEntities.map((ev) => {
      const event = ev.toObject();
      console.log(ev);
      return {
        ...event,
        _id: event._id.toString(),
        ownerId: event.ownerId.toString(),
      };
    });
    return events;
  }

  async findOne(id: string): Promise<ICreateEventDto | null> {
    const event = await this.eventModel.findById(id).lean().exec();
    return event != null
      ? ({
          ...event,
          _id: event!._id.toString(),
          ownerId: event.ownerId.toString(),
        } as ICreateEventDto)
      : null;
  }

  async findByUserId(userId: string): Promise<ICreateEventDto[]> {
    const objectIdOwner = new Types.ObjectId(userId);

    const eventsEntities = await this.eventModel
      .find({ ownerId: objectIdOwner })
      .exec();
    const events: ICreateEventDto[] = eventsEntities.map((ev) => {
      const event = ev.toObject();
      return {
        ...event,
        _id: event._id.toString(),
        ownerId: event.ownerId.toString(),
      };
    });
    return events;
  }
}
