import { Module } from '@nestjs/common';
import { CommuneService } from './commune.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([])],
  providers: [CommuneService],
  exports: [CommuneService, MongooseModule],
})
export class CommuneModule {}
