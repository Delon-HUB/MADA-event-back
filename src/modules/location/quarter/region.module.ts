import { Module } from '@nestjs/common';
import { QuarterService } from './quarter.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([])],
  providers: [QuarterService],
  exports: [QuarterService, MongooseModule],
})
export class QuarterModule {}
