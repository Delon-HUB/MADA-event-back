import { Injectable } from '@nestjs/common';
import { ICreateEventDto } from './dto/create-event.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    };
  }

  findAll() {
    return `This action returns all event`;
  }
}
