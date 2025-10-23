import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvinceEntity, ProvinceSchema } from './entities/province.entity';
import { ProvinceController } from './province.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProvinceEntity.name, schema: ProvinceSchema },
    ]),
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
