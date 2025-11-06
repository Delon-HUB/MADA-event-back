import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, SchemaTypes } from 'mongoose';
import { type ICreateUserDto } from '../../user/dto/create-user.dto';

@Schema({ timestamps: true, collection: 'payments' })
export class PaymentEntity {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'events' })
  ticketId: ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'users' })
  userId: ICreateUserDto;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  status?: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, default: new Date() })
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentEntity);
