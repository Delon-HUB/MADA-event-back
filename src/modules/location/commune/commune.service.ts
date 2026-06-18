import { Injectable } from '@nestjs/common';
import { ICommune } from './dto/commune.dto';

@Injectable()
export class CommuneService {
  constructor() {}

  async create(data: ICommune) {}

  async findByName(name: string) {}

  async findAll() {}
}
