import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, SchemaTypes } from 'mongoose';
import { RegionEntity } from '../../region/entities/region.entity';

@Schema({ collection: 'districts' })
export class DistrictEntity {
  @Prop({ required: true, toLowerCase: true, trim: true })
  name!: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: RegionEntity.name, required: true })
  regionId!: ObjectId | string;
}

export const DistrictSchema = SchemaFactory.createForClass(DistrictEntity);
