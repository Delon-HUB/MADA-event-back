import { HttpException, Injectable } from '@nestjs/common';
import { ProvinceEntity } from './entities/province.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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
      regionIds: created.regionIds?.map((regionId) => String(regionId)),
      _id: created._id.toString(),
    };
  }

  async addNewRegion(id: string, districtId: ObjectId) {
    const province = await this.provinceModel.findById(id);
    if (!province) throw new HttpException('REGION_NOT_FOUND', 404);
    province.regionIds.push(districtId);
    return province.save();
  }

  async findByName(provinceName: string): Promise<ProvinceEntity | null> {
    return await this.provinceModel
      .findOne({ province: provinceName.toLocaleLowerCase() })
      .populate('regions')
      .populate('districts')
      .exec();
  }
}
