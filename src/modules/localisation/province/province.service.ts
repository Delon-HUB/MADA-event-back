import { HttpException, Injectable } from '@nestjs/common';
import { ProvinceEntity } from './entities/province.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateProvinceDto } from './dto/create-province.dto';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectModel(ProvinceEntity.name)
    private readonly provinceModel: Model<ProvinceEntity>,
  ) {}

  async create(province: ICreateProvinceDto): Promise<ICreateProvinceDto> {
    const isAlreadyCreated =
      (await this.findByName(province.provinceName)) != null;
    if (isAlreadyCreated)
      throw new HttpException('PROVINCE_ALREADY_EXIST', 400);
    const newProvince = (
      await new this.provinceModel(province).save()
    ).toObject();
    return {
      ...newProvince,
      _id: newProvince._id.toString(),
    };
  }

  async findByName(provinceName: string): Promise<ProvinceEntity | null> {
    return this.provinceModel.findOne({ provinceName: provinceName }).exec();
  }
}
