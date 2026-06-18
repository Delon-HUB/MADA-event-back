import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([])],
  providers: [DistrictService],
  exports: [DistrictService, MongooseModule],
})
export class DistrictModule {}
