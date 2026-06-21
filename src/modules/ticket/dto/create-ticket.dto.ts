import { IEvent } from '../../event/dto/create-event.dto';
import { ICreateUserDto } from '../../user/dto/create-user.dto';

export interface ICreateTicketDto {
  _id?: string;
  userId: string | ICreateUserDto;
  eventId: string | IEvent;
  nbChild: number;
  nbAdult: number;
  nbSenior: number;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt?: Date;
  updatedAt?: Date;
}
