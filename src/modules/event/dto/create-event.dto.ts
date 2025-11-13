import { ICreateUserDto } from '../../user/dto/create-user.dto';

export class ICreateEventDto {
  _id?: string;
  ownerId: string | ICreateUserDto;
  title: string;
  description?: string;
  category: string;
  location: string;
  address: string;
  photo?: string;
  startDate: Date;
  endDate: Date;
  price: number;
  capacity: number;
  ticketAvailable?: number;
  status?: string;
  canceled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
