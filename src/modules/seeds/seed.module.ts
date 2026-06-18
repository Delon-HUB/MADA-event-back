import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { RegionService } from '../location/region/region.service';
import { RegionModule } from '../location/region/region.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from '../../app.module';

@Module({
  imports: [MongooseModule, AppModule, RegionModule],
  providers: [SeedService, RegionService],
})
export class SeedModule {}
