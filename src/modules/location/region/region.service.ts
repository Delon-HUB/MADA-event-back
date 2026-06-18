import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IRegion } from './dto/region.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RegionEntity } from './entities/region.entity';
import { Model } from 'mongoose';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(RegionEntity.name)
    private readonly regionModel: Model<RegionEntity>,
  ) {}

  async create(data: IRegion) {
    const found = await this.regionModel.findOne({ name: data.name });
    if (found)
      throw new HttpException('REGION_ALREADY_EXIST', HttpStatus.BAD_REQUEST);

    const created = await this.regionModel.create({ name: data.name });
    return created;
  }

  async findAll() {}
}
