import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, SchemaTypes } from 'mongoose';
import { CommuneEntity } from '../../commune/entities/commune.entity';

@Schema({ collection: 'quarters' })
export class QuarterEntity {
  @Prop({
    required: true,
    transform: (v) => v.toLowerCase().trim(),
    index: true,
  })
  name!: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: CommuneEntity.name,
    required: true,
    index: true,
  })
  communeId!: ObjectId | string;
}

export const QuarterSchema = SchemaFactory.createForClass(QuarterEntity);
