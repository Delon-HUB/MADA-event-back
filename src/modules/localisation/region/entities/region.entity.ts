import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, SchemaTypes } from 'mongoose';
import { ICreateDistrictDto } from '../../district/dto/create-district.dto';

@Schema({ collection: 'regions' })
export class RegionEntity {
  @Prop({ required: true, toLowerCase: true, trim: true })
  region: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'ProvinceEntity' })
  provinceId: ObjectId;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'DistrictEntity' }] })
  districtIds: ICreateDistrictDto[];
}

export const RegionSchema = SchemaFactory.createForClass(RegionEntity);
