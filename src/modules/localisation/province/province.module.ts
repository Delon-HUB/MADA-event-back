import { forwardRef, Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvinceEntity, ProvinceSchema } from './entities/province.entity';
import { ProvinceController } from './province.controller';
import { RegionModule } from '../region/region.module';
import { DistrictModule } from '../district/district.module';
import { RegionEntity, RegionSchema } from '../region/entities/region.entity';
import {
  DistrictEntity,
  DistrictSchema,
} from '../district/entities/district.entity';
@Module({
  imports: [
    forwardRef(() => DistrictModule),
    forwardRef(() => RegionModule),
    MongooseModule.forFeature([
      { name: DistrictEntity.name, schema: DistrictSchema },
      { name: RegionEntity.name, schema: RegionSchema },
      { name: ProvinceEntity.name, schema: ProvinceSchema },
    ]),
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService],
  exports: [ProvinceService],
})
export class ProvinceModule {}
