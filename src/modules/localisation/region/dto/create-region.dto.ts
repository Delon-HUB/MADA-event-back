import { ICreateProvinceDto } from '../../province/dto/create-province.dto';

export interface ICreateRegionDto {
  _id?: string;
  regionName: string;
  province: ICreateProvinceDto;
}
