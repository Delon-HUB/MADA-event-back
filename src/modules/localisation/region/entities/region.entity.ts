import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICreateRegionDto } from '../dto/create-region.dto';
import { SchemaTypes } from 'mongoose';
import type { ICreateProvinceDto } from '../../province/dto/create-province.dto';
import { ICreateDistrictDto } from '../../district/dto/create-district.dto';

@Schema({ collection: 'regions' })
export class RegionEntity implements ICreateRegionDto {
  _id?: string | undefined;

  @Prop({ required: true, toLowerCase: true, trim: true })
  region: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'provinces' })
  provinceObj: ICreateProvinceDto;

  @Prop({ type: SchemaTypes.Array, ref: 'districts' })
  districts: ICreateDistrictDto[];
}

export const RegionSchema = SchemaFactory.createForClass(RegionEntity);
