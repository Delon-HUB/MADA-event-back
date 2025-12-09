import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { type ICreateUserDto } from '../../user/dto/create-user.dto';
import { ICreateTicketDto } from '../../ticket/dto/create-ticket.dto';
import { PaymentStatus } from '../../../Enums/EStatus';

@Schema({ timestamps: true, collection: 'payments' })
export class PaymentEntity {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'tickets' })
  ticketId: string | ICreateTicketDto;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'users' })
  userId: string | ICreateUserDto;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 0 })
  refundedAmount?: number;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop()
  qrCodeUrl?: string;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: Date.now() })
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentEntity);
