import { ICommune } from '../../commune/dto/commune.dto';

export interface IQuarter {
  _id: string;
  name: string;
  communeId: string | ICommune;
}
