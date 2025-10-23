import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { ICreateProvinceDto } from '../dto/create-province.dto';
import { SchemaFactory } from '@nestjs/mongoose';
import { ICreateRegionDto } from '../../region/dto/create-region.dto';
import { SchemaTypes } from 'mongoose';

@Schema({ collection: 'provinces' })
export class ProvinceEntity implements ICreateProvinceDto {
  @Prop({ required: true, lowercase: true, trim: true })
  province: string;

  @Prop({ type: SchemaTypes.Array, ref: 'regions' })
  regions: ICreateRegionDto[];
}

export const ProvinceSchema = SchemaFactory.createForClass(ProvinceEntity);
