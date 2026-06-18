import { Injectable } from '@nestjs/common';
import { RegionService } from './region/region.service';

@Injectable()
export class LocationService {
  constructor(private readonly regionService: RegionService) {}

  async findAll() {
    return await this.regionService.findAll();
  }
}
