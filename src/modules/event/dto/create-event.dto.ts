import { ICreateUserDto } from '../../user/dto/create-user.dto';

export class ICreateEventDto extends Document {
  _id?: string;
  title: string;
  description?: string;
  category: string;
  photo?: string;
  startDate: Date;
  endDate: Date;
  price: number;
  capacity?: number;
  ticketsAvailable: number;
  participants: ICreateUserDto[];
  owner: ICreateUserDto;
  createdAt: Date;
  updatedAt: Date;
}
