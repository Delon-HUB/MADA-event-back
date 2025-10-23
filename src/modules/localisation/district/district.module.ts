import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DistrictEntity, DistrictSchema } from './entities/district.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DistrictEntity.name, schema: DistrictSchema },
    ]),
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
