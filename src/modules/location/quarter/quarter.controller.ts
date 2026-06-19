import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuarterService } from './quarter.service';

@Controller('quarter')
export class QuarterController {
  constructor(private readonly quarterService: QuarterService) {}

  @Get()
  async getAll() {
    return await this.quarterService.findAll();
  }

  @Get('search')
  async findByName(@Query('name') name: string) {
    return await this.quarterService.findByName(name);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.quarterService.findById(id);
  }
}
