import { Injectable } from '@nestjs/common';
import { IQuarter } from './dto/quarter.dto';

@Injectable()
export class QuarterService {
  constructor() {}

  async create(data: IQuarter) {}

  async findByName(name: string) {}

  async findAll() {}
}
