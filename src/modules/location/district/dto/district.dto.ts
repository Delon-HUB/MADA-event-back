import { ICommune } from '../../commune/dto/commune.dto';
import { IRegion } from '../../region/dto/region.dto';

export interface IDistrict {
  _id: string;
  name: string;
  regionId: string | IRegion;
  communes: ICommune[];
}
