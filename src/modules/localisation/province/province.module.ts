import { forwardRef, Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvinceEntity, ProvinceSchema } from './entities/province.entity';
import { ProvinceController } from './province.controller';
import { RegionModule } from '../region/region.module';
import { DistrictModule } from '../district/district.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProvinceEntity.name, schema: ProvinceSchema },
    ]),
    forwardRef(() => RegionModule),
    forwardRef(() => DistrictModule),
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService],
  exports: [ProvinceService],
})
export class ProvinceModule {}
