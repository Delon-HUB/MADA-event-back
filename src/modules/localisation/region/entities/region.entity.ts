import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, SchemaTypes } from 'mongoose';

@Schema({ collection: 'regions' })
export class RegionEntity {
  @Prop({ required: true, toLowerCase: true, trim: true })
  region: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'provinces' })
  provinceId: ObjectId;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'districts' }] })
  districtIds: ObjectId[];
}

export const RegionSchema = SchemaFactory.createForClass(RegionEntity);
