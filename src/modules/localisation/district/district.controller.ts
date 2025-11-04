import { Controller, Post } from '@nestjs/common';
import { DistrictService } from './district.service';

@Controller('localisation/district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Post()
  async getAll() {
    return await this.districtService.findAll();
  }
}
