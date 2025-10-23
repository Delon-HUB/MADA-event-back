import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { ICreateProvinceDto } from '../dto/create-province.dto';
import { SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'provinces' })
export class ProvinceEntity implements ICreateProvinceDto {
  @Prop({ required: true, lowercase: true,trim: true })
  province: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(ProvinceEntity);
