import { Injectable, Logger } from '@nestjs/common';
import { RegionService } from '../location/region/region.service';
import { IRegion } from '../location/region/dto/region.dto';

import regionData from '../location/data/regions.json';
import districtData from '../location/data/districts.json';
import communeData from '../location/data/communes.json';
import quarterData from '../location/data/quarters.json';

import { DistrictService } from '../location/district/district.service';
import { IDistrict } from '../location/district/dto/district.dto';
import { CommuneService } from '../location/commune/commune.service';
import { ICommune } from '../location/commune/dto/commune.dto';
import { QuarterService } from '../location/quarter/quarter.service';
import { IQuarter } from '../location/quarter/dto/quarter.dto';

@Injectable()
export class SeedService {
  constructor(
    private readonly regionService: RegionService,
    private readonly districtService: DistrictService,
    private readonly communeService: CommuneService,
    private readonly quarterService: QuarterService,
  ) {}

  async run() {
    const logger = new Logger();
    logger.log('CREATING LOCATION...');
    const regions = (await this.createLocation()) as IRegion[];
    logger.log('LOCATION CREATED');
  }

  async createLocation() {
    const regions = regionData.region;
    const createdList = Promise.all(
      await regions.map(async (r) => {
        const regionCreated = (await this.regionService.create({
          name: r,
        } as IRegion)) as IRegion;

        const districts = districtData[r] as string[];
        const districtCreatedList = await Promise.all(
          await districts.map(async (d) => {
            const districtCreated = (await this.districtService.create({
              name: d,
              regionId: regionCreated._id.toString(),
            } as IDistrict)) as IDistrict;

            const communes = communeData[r][d] as string[];
            const communeCreatedList = await Promise.all(
              await communes.map(async (c) => {
                const communeCreated = (await this.communeService.create({
                  name: c,
                  districtId: districtCreated._id.toString(),
                } as ICommune)) as ICommune;

                const quarters = (
                  quarterData[r][c] as {
                    commune: string;
                    region: string;
                    fokontany: string;
                    district: string;
                  }[]
                ).map((q) => q.fokontany);

                const quarterCreatedList = await Promise.all(
                  await quarters.map(async (q) => {
                    const quarterCreated = (await this.quarterService.create({
                      name: q,
                      communeId: communeCreated._id.toString(),
                    } as IQuarter)) as IQuarter;

                    return quarterCreated;
                  }),
                );

                return {
                  ...communeCreated,
                  quarters: quarterCreatedList,
                };
              }),
            );

            return {
              ...districtCreated,
              communes: communeCreatedList,
            };
          }),
        );

        return {
          ...regionCreated,
          districts: districtCreatedList,
        };
      }),
    );

    return createdList;
  }
}
