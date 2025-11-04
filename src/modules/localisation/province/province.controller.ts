import { Body, Controller, Post, Get } from '@nestjs/common';
import { ICreateProvinceDto } from './dto/create-province.dto';
import { ProvinceService } from './province.service';
import { RegionService } from '../region/region.service';
import { DistrictService } from '../district/district.service';

@Controller('province')
export class ProvinceController {
  constructor(
    private readonly provinceService: ProvinceService,
    private readonly regionService: RegionService,
    private readonly districtService: DistrictService,
  ) {}

  @Post('insert-many')
  async insertMany(@Body() provinces: ICreateProvinceDto[]) {
    const provincesCreated = await provinces.map(async (province) => {
      // provinces
      const provinceCreated = await this.provinceService.create(province);
      //regions
      province.regions?.map(async (region) => {
        region.provinceId = provinceCreated._id!;
        const regionCreated = await this.regionService.create(region);
        // districts
        region.districts?.map(async (district) => {
          district.regionId = regionCreated._id!;
          const districtCreated = await this.districtService.create(district);
        });
      });
    });
    return provincesCreated;
  }
}
