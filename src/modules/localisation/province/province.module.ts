import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvinceEntity, ProvinceSchema } from './entities/province.entity';
import { ProvinceController } from './province.controller';
import { RegionModule } from '../region/region.module';
import { DistrictModule } from '../district/district.module';
import { RegionService } from '../region/region.service';
import { DistrictService } from '../district/district.service';
import { RegionEntity, RegionSchema } from '../region/entities/region.entity';
import {
  DistrictEntity,
  DistrictSchema,
} from '../district/entities/district.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProvinceEntity.name, schema: ProvinceSchema },
      { name: RegionEntity.name, schema: RegionSchema },
      { name: DistrictEntity.name, schema: DistrictSchema },
    ]),
    RegionModule,
    DistrictModule,
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService, RegionService, DistrictService],
})
export class ProvinceModule {}
