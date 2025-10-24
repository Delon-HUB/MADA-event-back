import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DistrictEntity, DistrictSchema } from './entities/district.entity';
import { RegionModule } from '../region/region.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DistrictEntity.name, schema: DistrictSchema },
    ]),
    RegionModule,
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}
