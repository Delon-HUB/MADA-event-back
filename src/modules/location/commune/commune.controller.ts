import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommuneService } from './commune.service';

@Controller('commune')
export class CommuneController {
  constructor(private readonly communeService: CommuneService) {}

  @Get()
  async getAll() {
    return await this.communeService.findAll();
  }

  @Get('search')
  async findByName(@Query('name') name: string) {
    return await this.communeService.findByName(name);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.communeService.findById(id);
  }
}
