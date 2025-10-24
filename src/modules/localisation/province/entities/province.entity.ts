import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, SchemaTypes } from 'mongoose';

@Schema({ collection: 'provinces' })
export class ProvinceEntity {
  @Prop({ required: true, lowercase: true, trim: true })
  province: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'regions' }] })
  regionIds: ObjectId[];
}

export const ProvinceSchema = SchemaFactory.createForClass(ProvinceEntity);
