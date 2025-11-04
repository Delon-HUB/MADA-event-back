import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { ICreateUserDto } from '../../user/dto/create-user.dto';
import { SchemaTypes } from 'mongoose';

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

  @Prop()
  ticketsAvailable?: number;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'users' }] })
  participants: ICreateUserDto[];

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'users' })
  owner: ICreateUserDto;

  @Prop({ required: true, default: new Date(Date.now()) })
  createdAt: Date;

  @Prop({ required: true, default: new Date(Date.now()) })
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(EventEntity);
