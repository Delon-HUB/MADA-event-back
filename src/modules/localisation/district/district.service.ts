import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DistrictEntity } from './entities/district.entity';
import { ICreateDistrictDto } from './dto/create-district.dto';
import { RegionService } from '../region/region.service';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(DistrictEntity.name)
    private readonly districtModel: Model<DistrictEntity>,
    private readonly regionService: RegionService,
  ) {}

  async create(district: ICreateDistrictDto): Promise<ICreateDistrictDto> {
    const isAlreadyCreated = (await this.findByName(district.district)) != null;
    if (isAlreadyCreated)
      throw new HttpException('DISTRICT_ALREADY_EXIST', 400);
    const created = await this.districtModel.create(district);
    this.regionService.addNewDistrict(created.regionId.toString(), created.id);
    return {
      ...created,
      regionId: created._id.toString(),
      _id: created._id.toString(),
    };
  }

  async findByName(districtName: string): Promise<DistrictEntity | null> {
    return await this.districtModel
      .findOne({ regionName: districtName })
      .exec();
  }
}
