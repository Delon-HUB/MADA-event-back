import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionEntity, RegionSchema } from './entities/region.entity';
import {
  DistrictEntity,
  DistrictSchema,
} from '../district/entities/district.entity';
import { DistrictModule } from '../district/district.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RegionEntity.name, schema: RegionSchema },
      { name: DistrictEntity.name, schema: DistrictSchema },
    ]),
    DistrictModule,
  ],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
