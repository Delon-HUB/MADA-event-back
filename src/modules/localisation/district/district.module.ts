import { forwardRef, Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DistrictEntity, DistrictSchema } from './entities/district.entity';
import { RegionModule } from '../region/region.module';
import {
  ProvinceEntity,
  ProvinceSchema,
} from '../province/entities/province.entity';
import { RegionEntity, RegionSchema } from '../region/entities/region.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DistrictEntity.name, schema: DistrictSchema },
      { name: RegionEntity.name, schema: RegionSchema },
      { name: ProvinceEntity.name, schema: ProvinceSchema },
    ]),
    forwardRef(() => RegionModule),
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService, MongooseModule],
})
export class DistrictModule {}
