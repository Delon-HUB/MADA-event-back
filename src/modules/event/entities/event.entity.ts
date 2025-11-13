import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, SchemaTypes } from 'mongoose';
import { ICreateUserDto } from '../../user/dto/create-user.dto';
import { EventStatus } from '../../../Enums/EStatus';

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
  capacity: number;

  @Prop()
  ticketAvailable?: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'users' })
  ownerId: ObjectId;

  @Prop({ required: true, default: false })
  canceled: boolean;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(EventEntity);
EventSchema.virtual('status').get(function () {
  if (this.canceled) return EventStatus.CANCELLED;
  const now = new Date();
  if (now < this.startDate) return EventStatus.UPCOMING;
  if (now >= this.startDate && now <= this.endDate) return EventStatus.ONGOING;
  return EventStatus.ENDED;
});

EventSchema.set('toJSON', { virtuals: true });
