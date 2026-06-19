import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, SchemaTypes } from 'mongoose';
import { DistrictEntity } from '../../district/entities/district.entity';

@Schema({ collection: 'districts' })
export class CommuneEntity {
  @Prop({
    required: true,
    transform: (v) => v.toLowerCase().trim(),
    index: true,
  })
  name!: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DistrictEntity.name,
    required: true,
    index: true,
  })
  districtId!: ObjectId | string;
}

export const CommuneSchema = SchemaFactory.createForClass(CommuneEntity);
