import { Injectable } from '@nestjs/common';
import { IDistrict } from './dto/district.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DistrictEntity } from './entities/district.entity';
import { Model } from 'mongoose';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(DistrictEntity.name)
    private readonly districtModel: Model<DistrictEntity>,
  ) {}

  async create(data: IDistrict): Promise<IDistrict> {
    const created = (await this.districtModel.create(data)).toObject();
    return {
      ...created,
      _id: created._id.toString(),
      regionId: created.regionId.toString(),
      communes: [],
    };
  }
}
