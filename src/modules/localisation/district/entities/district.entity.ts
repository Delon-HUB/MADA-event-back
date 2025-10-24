import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { type ICreateRegionDto } from '../../region/dto/create-region.dto';

@Schema({ collection: 'districts' })
export class DistrictEntity {
  @Prop({ required: true, toLowerCase: true, trim: true })
  district: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'RegionEntity', required: true })
  regionId: ICreateRegionDto;
}

export const DistrictSchema = SchemaFactory.createForClass(DistrictEntity);
