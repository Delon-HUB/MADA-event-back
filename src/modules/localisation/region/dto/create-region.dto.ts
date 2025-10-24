import { ICreateDistrictDto } from '../../district/dto/create-district.dto';

export interface ICreateRegionDto {
  _id?: string;
  region: string;
  provinceId: string;
  districts: ICreateDistrictDto[];
}
