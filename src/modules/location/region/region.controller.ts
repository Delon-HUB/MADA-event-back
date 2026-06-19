import { Controller, Get, Param, Query } from '@nestjs/common';
import { RegionService } from './region.service';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  async getAll() {
    return await this.regionService.findAll();
  }

  @Get('search')
  async findByName(@Query('name') name: string) {
    console.log('find by name');
    return await this.regionService.findByName(name);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.regionService.findById(id);
  }
}
