import { Injectable } from '@nestjs/common';
import { ICreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  create(createEventDto: ICreateEventDto) {
    return 'This action adds a new event';
  }

  findAll() {
    return `This action returns all event`;
  }
}
