import { ICreateRegionDto } from '../../region/dto/create-region.dto';

export interface ICreateProvinceDto {
  _id?: string;
  province: string;
  regions?: ICreateRegionDto[];
}
