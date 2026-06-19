import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { RegionService } from '../location/region/region.service';
import { RegionModule } from '../location/region/region.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from '../../app.module';
import { DistrictModule } from '../location/district/district.module';
import { DistrictService } from '../location/district/district.service';
import { CommuneModule } from '../location/commune/commune.module';
import { CommuneService } from '../location/commune/commune.service';
import { QuarterModule } from '../location/quarter/quarter.module';
import { QuarterService } from '../location/quarter/quarter.service';

@Module({
  imports: [
    MongooseModule,
    AppModule,
    RegionModule,
    DistrictModule,
    CommuneModule,
    QuarterModule,
  ],
  providers: [
    SeedService,
    RegionService,
    DistrictService,
    CommuneService,
    QuarterService,
  ],
})
export class SeedModule {}
