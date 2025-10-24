import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionEntity, RegionSchema } from './entities/region.entity';
import { ProvinceModule } from '../province/province.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RegionEntity.name, schema: RegionSchema },
    ]),
    ProvinceModule,
  ],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
