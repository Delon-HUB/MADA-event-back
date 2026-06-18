import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'regions' })
export class RegionEntity {
  @Prop({ required: true, transform: (v) => v.toLowerCase().trim() })
  name!: string;
}

export const RegionSchema = SchemaFactory.createForClass(RegionEntity);
