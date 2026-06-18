import { ICommune } from '../../commune/dto/commune.dto';

export interface IDistrict {
  _id: string;
  name: string;
  regionId: string;
  communes: ICommune[];
}
