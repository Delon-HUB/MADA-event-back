import { ICreateRegionDto } from '../../region/dto/create-region.dto';

export interface ICreateDistrictDto {
  _id?: string;
  district: string;
  regionObj?: ICreateRegionDto;
}
