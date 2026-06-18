import { Injectable, Logger } from '@nestjs/common';
import regionData from '../location/data/regions.json';
import { RegionService } from '../location/region/region.service';
import { IRegion } from '../location/region/dto/region.dto';

@Injectable()
export class SeedService {
  constructor(private readonly regionService: RegionService) {}

  async run() {
    const regions = await this.createRegion();
    const logger = new Logger();
    logger.log(regions);
  }

  async createRegion() {
    const regions = regionData.region;
    const createdList = Promise.all(
      await regions.map(async (r) => {
        const created = await this.regionService.create({ name: r } as IRegion);
        return created;
      }),
    );

    return createdList;
  }
}
