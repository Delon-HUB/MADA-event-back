import { ICreateUserDto } from '../../user/dto/create-user.dto';

export class ICreateEventDto {
  _id?: string;
  title: string;
  description?: string;
  category: string;
  location: string;
  photo?: string;
  startDate: Date;
  endDate: Date;
  price: number;
  capacity?: number;
  ticketsAvailable?: number;
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
