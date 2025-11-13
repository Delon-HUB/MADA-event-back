import { PaymentStatus } from '../../../Enums/EStatus';
import { ICreateTicketDto } from '../../ticket/dto/create-ticket.dto';
import { ICreateUserDto } from '../../user/dto/create-user.dto';

export interface ICreatePaymentDto {
  _id?: string;
  userId: string | ICreateUserDto;
  ticketId: string | ICreateTicketDto;
  amount: number;
  method: string;
  phoneNumber: string;
  status?: PaymentStatus;
  qrCodeUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
