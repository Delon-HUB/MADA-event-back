import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'provinces' })
export class ProvinceEntity {
  @Prop({ required: true, lowercase: true, trim: true })
  province: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(ProvinceEntity);
