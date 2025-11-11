import { ICreateTicketDto } from '../../ticket/dto/create-ticket.dto';

export interface ICreatePaymentDto {
  _id?: string;
  userId: string;
  ticketId: string | ICreateTicketDto;
  amount: number;
  method: string;
  phoneNumber: string;
  status: string;
  qrCodeUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
