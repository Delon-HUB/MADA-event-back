import { IDistrict } from '../../district/dto/district.dto';

export interface IRegion {
  _id: string;
  name: string;
  districts: IDistrict[];
}
