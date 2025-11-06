import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ICreateEventDto } from '../../event/dto/create-event.dto';

@Schema({ timestamps: true })
export class TicketEntity {
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

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

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, default: new Date() })
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(TicketEntity);
