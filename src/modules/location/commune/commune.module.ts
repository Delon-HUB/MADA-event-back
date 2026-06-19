import { Module } from '@nestjs/common';
import { CommuneService } from './commune.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CommuneEntity, CommuneSchema } from './entities/commune.entity';
import { CommuneController } from './commune.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommuneEntity.name, schema: CommuneSchema },
    ]),
  ],
  controllers: [CommuneController],
  providers: [CommuneService],
  exports: [CommuneService, MongooseModule],
})
export class CommuneModule {}
