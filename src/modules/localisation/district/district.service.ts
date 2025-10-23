import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DistrictEntity } from './entities/district.entity';
import { ICreateDistrictDto } from './dto/create-district.dto';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(DistrictEntity.name)
    private readonly districtModel: Model<DistrictEntity>,
  ) {}

  async create(district: ICreateDistrictDto): Promise<ICreateDistrictDto> {
    const isAlreadyCreated = (await this.findByName(district.district)) != null;
    if (isAlreadyCreated)
      throw new HttpException('PROVINCE_ALREADY_EXIST', 400);
    const newDistrict = (
      await new this.districtModel(district).save()
    ).toObject();
    return {
      ...newDistrict,
      _id: newDistrict._id.toString(),
    };
  }

  async findByName(districtName: string): Promise<DistrictEntity | null> {
    return this.districtModel.findOne({ regionName: districtName }).exec();
  }
}
