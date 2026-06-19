import { Injectable } from '@nestjs/common';
import { IDistrict } from './dto/district.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DistrictEntity } from './entities/district.entity';
import { Model } from 'mongoose';
import { IRegion } from '../region/dto/region.dto';

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

  async findByName(name: string): Promise<IDistrict[]> {
    const result = await this.districtModel
      .find({ name: { $regex: `^${name}`, $options: 'i' } }, {}, { limit: 20 })
      .exec();
    return result.map((d) => ({
      ...d.toObject(),
      _id: d._id.toString(),
      regionId: d.regionId as unknown as IRegion,
      communes: [],
    }));
  }

  async findAll(): Promise<IDistrict[]> {
    const districts = await this.districtModel.find().exec();
    return districts.map((district) => {
      const d = district.toObject();
      return {
        ...d,
        _id: d._id?.toString(),
        regionId: d.regionId?.toString(),
        communes: [],
      };
    });
  }

  async findByRegionId(regionId: string): Promise<IDistrict[]> {
    const districts = await this.districtModel.find({ regionId }).exec();
    return districts.map((district) => {
      const d = district.toObject() as unknown as IDistrict;
      return {
        ...d,
        _id: d._id.toString(),
        regionId: d.regionId.toString(),
        communes: [],
      };
    });
  }

  async findById(_id: string): Promise<IDistrict | null> {
    const found = await this.districtModel.findById({ _id }).exec();
    return found
      ? {
          ...found.toObject(),
          _id: found._id.toString(),
          communes: [],
          regionId: found.regionId.toString(),
        }
      : null;
  }
}
