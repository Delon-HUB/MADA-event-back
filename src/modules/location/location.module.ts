import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { RegionService } from './region/region.service';
import { RegionModule } from './region/region.module';
import { CommuneService } from './commune/commune.service';
import { DistrictService } from './district/district.service';
import { QuarterService } from './quarter/quarter.service';
import { DistrictModule } from './district/district.module';
import { CommuneModule } from './commune/commune.module';
import { QuarterModule } from './quarter/region.module';

@Module({
  imports: [
    MongooseModule,
    RegionModule,
    DistrictModule,
    CommuneModule,
    QuarterModule,
  ],
  controllers: [LocationController],
  providers: [
    LocationService,
    RegionService,
    DistrictService,
    CommuneService,
    QuarterService,
  ],
})
export class LocationModule {}
