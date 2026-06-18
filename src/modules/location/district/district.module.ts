import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DistrictEntity, DistrictSchema } from './entities/district.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DistrictEntity.name, schema: DistrictSchema },
    ]),
  ],
  providers: [DistrictService],
  exports: [DistrictService, MongooseModule],
})
export class DistrictModule {}
