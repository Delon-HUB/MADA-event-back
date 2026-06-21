import { Module } from '@nestjs/common';
import { QuarterService } from './quarter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuarterEntity, QuarterSchema } from './entities/quarter.entity';
import { QuarterController } from './quarter.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuarterEntity.name, schema: QuarterSchema },
    ]),
  ],
  controllers: [QuarterController],
  providers: [QuarterService],
  exports: [QuarterService, MongooseModule],
})
export class QuarterModule {}
