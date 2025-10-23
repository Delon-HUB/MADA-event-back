import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegionEntity } from './entities/region.entity';
import { Model } from 'mongoose';
import { ICreateRegionDto } from './dto/create-region.dto';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(RegionEntity.name)
    private readonly regionModel: Model<RegionEntity>,
  ) {}

  async create(region: ICreateRegionDto): Promise<ICreateRegionDto> {
    const isAlreadyCreated = (await this.findByName(region.region)) != null;
    if (isAlreadyCreated)
      throw new HttpException('PROVINCE_ALREADY_EXIST', 400);
    const newRegion = (await new this.regionModel(region).save()).toObject();
    return {
      ...newRegion,
      _id: newRegion._id.toString(),
    };
  }

  async findByName(regionName: string): Promise<RegionEntity | null> {
    return this.regionModel.findOne({ region: regionName }).exec();
  }
}
