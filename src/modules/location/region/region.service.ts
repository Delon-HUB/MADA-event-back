import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IRegion } from './dto/region.dto';
import { RegionEntity } from './entities/region.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(RegionEntity.name)
    private readonly regionModel: Model<RegionEntity>,
  ) {}

  async create(data: IRegion): Promise<IRegion> {
    const found = await this.regionModel.findOne({ name: data.name });
    if (found)
      throw new HttpException('REGION_ALREADY_EXIST', HttpStatus.BAD_REQUEST);

    const created = (
      await this.regionModel.create({ name: data.name })
    ).toObject();
    return {
      ...created,
      _id: created._id.toString(),
      districts: [],
    };
  }

  async findByName(name: string): Promise<IRegion[]> {
    const result = await this.regionModel
      .find({ name: { $regex: `^${name}`, $options: 'i' } }, {}, { limit: 20 })
      .exec();
    return result.map((r) => ({
      ...r.toObject(),
      _id: r._id.toString(),
      districts: [],
    }));
  }

  async findAll(): Promise<IRegion[]> {
    const regions = await this.regionModel.find().exec();
    return regions.map((r) => ({
      ...r.toObject(),
      _id: r._id.toString(),
      districts: [],
    }));
  }

  async findById(_id: string): Promise<IRegion | null> {
    const found = await this.regionModel.findById({ _id }).exec();
    return found
      ? {
          ...found.toObject(),
          _id: found._id.toString(),
          districts: [],
        }
      : null;
  }
}
