import { ICreateDistrictDto } from '../../district/dto/create-district.dto';
import { ICreateProvinceDto } from '../../province/dto/create-province.dto';

export interface ICreateRegionDto {
  _id?: string;
  region: string;
  provinceObj: ICreateProvinceDto;
  districts: ICreateDistrictDto[];
}
