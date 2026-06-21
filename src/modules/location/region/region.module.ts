import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionEntity, RegionSchema } from './entities/region.entity';
import { RegionController } from './region.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RegionEntity.name, schema: RegionSchema },
    ]),
  ],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService, MongooseModule],
})
export class RegionModule {}
