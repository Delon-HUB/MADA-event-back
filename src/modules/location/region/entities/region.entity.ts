import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'regions' })
export class RegionEntity {
  @Prop({
    required: true,
    transform: (v) => v.toLowerCase().trim(),
    index: true,
  })
  name!: string;
}

export const RegionSchema = SchemaFactory.createForClass(RegionEntity);
