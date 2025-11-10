import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ICreateEventDto } from '../../event/dto/create-event.dto';
import { type ICreateUserDto } from '../../user/dto/create-user.dto';

@Schema({ timestamps: true, collection: 'tickets' })
export class TicketEntity {
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: ICreateUserDto;

  @Prop({ type: Types.ObjectId, ref: 'events', required: true })
  eventId: ICreateEventDto;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: ['PENDING', 'PAID', 'CANCELLED'] })
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED';

  @Prop({ required: false })
  paymentMethod?: string;

  @Prop({ required: false })
  qrCodeUrl?: string;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(TicketEntity);
