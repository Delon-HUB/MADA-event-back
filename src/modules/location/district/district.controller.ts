import { Controller, Get, Param, Query } from '@nestjs/common';
import { DistrictService } from './district.service';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  async getAll() {
    return await this.districtService.findAll();
  }

  @Get('search')
  async findByName(@Query('name') name: string) {
    return await this.districtService.findByName(name);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.districtService.findById(id);
  }
}
