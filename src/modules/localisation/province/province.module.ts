import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvinceEntity, ProvinceSchema } from './entities/province.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProvinceEntity.name, schema: ProvinceSchema },
    ]),
  ],
  providers: [ProvinceService],
})
export class ProvinceModule {}
