import { Controller, Get } from '@nestjs/common';
import { DistrictService } from './district.service';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  async getAll() {
    return await this.districtService.findAll();
  }
}
