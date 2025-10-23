import { Body, Controller, Post, Get } from '@nestjs/common';
import { ICreateProvinceDto } from './dto/create-province.dto';
import { ProvinceService } from './province.service';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  test() {
    return 'hello';
  }
  @Post('insert-many')
  async insertMany(@Body() provinces: ICreateProvinceDto[]) {
    return await provinces.map(
      async (province) => await this.provinceService.create(province),
    );
  }
}
