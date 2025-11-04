import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, SchemaTypes } from 'mongoose';

@Schema({ collection: 'regions' })
export class RegionEntity {
  @Prop({ required: true, toLowerCase: true, trim: true })
  region: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'ProvinceEntity' })
  provinceId: ObjectId;
}

export const RegionSchema = SchemaFactory.createForClass(RegionEntity);
