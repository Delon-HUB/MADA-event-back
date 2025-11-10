import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, SchemaTypes } from 'mongoose';
import { ICreateUserDto } from '../../user/dto/create-user.dto';

@Schema({ timestamps: true, collection: 'events' })
export class EventEntity {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  photo?: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  price: number;

  @Prop()
  capacity?: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'users' })
  ownerId: ObjectId;

  @Prop({
    required: true,
    default: [],
    type: [{ type: SchemaTypes.ObjectId, ref: 'users' }],
  })
  participants: ICreateUserDto[];

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(EventEntity);
