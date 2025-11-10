import { ICreateUserDto } from '../../user/dto/create-user.dto';

export interface ICreatePaymentDto {
  _id?: string;
  ticketId?: string;
  eventId?: string;
  userId: string | ICreateUserDto;
  amount: number;
  method: string;
  phoneNumber: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
