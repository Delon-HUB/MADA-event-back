import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICreateDistrictDto } from '../dto/create-district.dto';
import { SchemaTypes } from 'mongoose';
import type { ICreateRegionDto } from '../../region/dto/create-region.dto';

@Schema({ collection: 'districts' })
export class DistrictEntity implements ICreateDistrictDto {
  @Prop({ required: true })
  districtName: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'regions' })
  region: ICreateRegionDto;
}

export const DistrictSchema = SchemaFactory.createForClass(DistrictEntity);
