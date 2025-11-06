import { ICreateEventDto } from '../../event/dto/create-event.dto';

export interface ICreateTicketDto {
  _id?: string;
  userId: string;
  eventId: string | ICreateEventDto;
  price: number;
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentMethod?: string;
  qrCodeUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
