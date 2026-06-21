import { Injectable } from '@nestjs/common';
import { RegionService } from './region/region.service';
import { DistrictService } from './district/district.service';
import { CommuneService } from './commune/commune.service';
import { QuarterService } from './quarter/quarter.service';

@Injectable()
export class LocationService {
  constructor(
    private readonly regionService: RegionService,
    private readonly districtService: DistrictService,
    private readonly communeService: CommuneService,
    private readonly quarterService: QuarterService,
  ) {}

  async findAll() {
    const regions = await this.regionService.findAll();

    await Promise.all(
      regions.map(async (region) => {
        region.districts = await this.districtService.findByRegionId(
          region._id,
        );
        await Promise.all(
          await region.districts.map(async (district) => {
            district.communes = await this.communeService.findByDistrictId(
              district._id,
            );
            await district.communes.map(async (commune) => {
              commune.quarters = await this.quarterService.findByCommuneId(
                commune._id,
              );
            });
          }),
        );
      }),
    );

    return regions;
  }
}
