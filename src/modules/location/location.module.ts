import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { RegionService } from './region/region.service';
import { RegionModule } from './region/region.module';

@Module({
  imports: [MongooseModule, RegionModule],
  controllers: [LocationController],
  providers: [LocationService, RegionService],
})
export class LocationModule {}
