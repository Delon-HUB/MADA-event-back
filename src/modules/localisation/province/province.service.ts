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
    const isAlreadyCreated = (await this.findByName(province.province)) != null;
    if (isAlreadyCreated)
      throw new HttpException('PROVINCE_ALREADY_EXIST', 400);
    const created = await this.provinceModel.create(province);
    return {
      ...created,
      regions: [],
      _id: created._id.toString(),
    };
  }

  async findByName(provinceName: string): Promise<ProvinceEntity | null> {
    return await this.provinceModel
      .findOne({ province: provinceName.toLocaleLowerCase() })
      .exec();
  }

  async findAll(): Promise<ProvinceEntity[] | null> {
    return await this.provinceModel
      .find()
      .populate({
        path: 'regionIds',
        populate: {
          path: 'districtIds',
        },
      })
      .exec();
  }
}
