import { ICreateRegionDto } from '../../region/dto/create-region.dto';

export interface ICreateDistrictDto {
  _id?: string;
  districtName: string;
  region: ICreateRegionDto;
}
