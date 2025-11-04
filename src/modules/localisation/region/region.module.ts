import { forwardRef, Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionEntity, RegionSchema } from './entities/region.entity';
import { ProvinceModule } from '../province/province.module';
import { DistrictModule } from '../district/district.module';
import {
  DistrictEntity,
  DistrictSchema,
} from '../district/entities/district.entity';
import {
  ProvinceEntity,
  ProvinceSchema,
} from '../province/entities/province.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DistrictEntity.name, schema: DistrictSchema },
      { name: RegionEntity.name, schema: RegionSchema },
      { name: ProvinceEntity.name, schema: ProvinceSchema },
    ]),
    forwardRef(() => ProvinceModule),
    forwardRef(() => DistrictModule),
  ],
  providers: [RegionService],
  exports: [RegionService, MongooseModule],
})
export class RegionModule {}
