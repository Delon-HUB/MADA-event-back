import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, SchemaTypes } from 'mongoose';

@Schema({ collection: 'districts' })
export class DistrictEntity {
  @Prop({ required: true, toLowerCase: true, trim: true })
  district: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'regions', required: true })
  regionId: ObjectId;
}

export const DistrictSchema = SchemaFactory.createForClass(DistrictEntity);
