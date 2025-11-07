import { ICreateEventDto } from '../../event/dto/create-event.dto';
import { ICreateUserDto } from '../../user/dto/create-user.dto';

export interface ICreateTicketDto {
  _id?: string;
  userId: string | ICreateUserDto;
  eventId: string | ICreateEventDto;
  price: number;
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentMethod?: string;
  qrCodeUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
