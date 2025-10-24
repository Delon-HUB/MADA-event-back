import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { ICreateRegionDto } from '../../region/dto/create-region.dto';
import { RegionEntity } from '../../region/entities/region.entity';

@Schema({ collection: 'provinces' })
export class ProvinceEntity {
  @Prop({ required: true, lowercase: true, trim: true })
  province: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'RegionEntity' }] })
  regionIds: ICreateRegionDto[];
}

export const ProvinceSchema = SchemaFactory.createForClass(ProvinceEntity);
