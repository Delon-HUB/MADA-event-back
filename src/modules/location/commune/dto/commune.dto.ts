import { IQuarter } from '../../quarter/dto/quarter.dto';

export interface ICommune {
  _id: string;
  name: string;
  districtId: string;
  quarters: IQuarter[];
}
