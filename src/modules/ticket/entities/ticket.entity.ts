import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ICreateEventDto } from '../../event/dto/create-event.dto';
import { type ICreateUserDto } from '../../user/dto/create-user.dto';

@Schema({ timestamps: true, collection: 'tickets' })
export class TicketEntity {
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: string | ICreateUserDto;

  @Prop({ type: Types.ObjectId, ref: 'events', required: true })
  eventId: string | ICreateEventDto;

  @Prop({ required: true })
  nbChild: number;

  @Prop({ required: true })
  nbAdult: number;

  @Prop({ required: true })
  nbSenior: number;

  @Prop({ required: true, default: 'PENDING' })
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(TicketEntity);
