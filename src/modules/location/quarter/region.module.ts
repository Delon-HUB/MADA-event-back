import { Module } from '@nestjs/common';
import { QuarterService } from './quarter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuarterEntity, QuarterSchema } from './entities/quarter.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuarterEntity.name, schema: QuarterSchema },
    ]),
  ],
  providers: [QuarterService],
  exports: [QuarterService, MongooseModule],
})
export class QuarterModule {}
