import { Injectable } from '@nestjs/common';
import { IDistrict } from './dto/district.dto';

@Injectable()
export class DistrictService {
  constructor() {}

  async create(data: IDistrict) {}

  async findByName(name: string) {}

  async findAll() {}
}
