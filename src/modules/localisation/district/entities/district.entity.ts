import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICreateDistrictDto } from '../dto/create-district.dto';
import { SchemaTypes } from 'mongoose';
import type { ICreateRegionDto } from '../../region/dto/create-region.dto';

@Schema({ collection: 'districts' })
export class DistrictEntity implements ICreateDistrictDto {
  @Prop({ required: true, toLowerCase: true, trim: true })
  district: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'regions' })
  regionObj: ICreateRegionDto;
}

export const DistrictSchema = SchemaFactory.createForClass(DistrictEntity);
