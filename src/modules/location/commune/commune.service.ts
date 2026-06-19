import { Injectable } from '@nestjs/common';
import { ICommune } from './dto/commune.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CommuneEntity } from './entities/commune.entity';
import { Model } from 'mongoose';
import { IDistrict } from '../district/dto/district.dto';

@Injectable()
export class CommuneService {
  constructor(
    @InjectModel(CommuneEntity.name)
    private readonly communeModel: Model<CommuneEntity>,
  ) {}

  async create(data: ICommune): Promise<ICommune> {
    const created = (await this.communeModel.create(data)).toObject();
    return {
      ...created,
      _id: created._id.toString(),
      districtId: created.districtId.toString(),
      quarters: [],
    };
  }

  async findByName(name: string): Promise<ICommune[]> {
    const result = await this.communeModel
      .find({ name: { $regex: `^${name}`, $options: 'i' } }, {}, { limit: 20 })
      .exec();
    return result.map((c) => ({
      ...c.toObject(),
      _id: c._id.toString(),
      districtId: c.districtId as unknown as IDistrict,
      quarters: [],
    }));
  }

  async findAll(): Promise<ICommune[]> {
    const communes = await this.communeModel.find().exec();
    return communes.map((c) => ({
      ...c.toObject(),
      _id: c._id.toString(),
      districtId: c.districtId?.toString(),
      quarters: [],
    }));
  }

  async findByDistrictId(districtId: string): Promise<ICommune[]> {
    const communes = await this.communeModel.find({ districtId }).exec();
    return communes.map((c) => ({
      ...c.toObject(),
      _id: c._id.toString(),
      districtId: c.districtId.toString(),
      quarters: [],
    }));
  }

  async findById(_id: string): Promise<ICommune | null> {
    const found = await this.communeModel.findById({ _id }).exec();
    return found
      ? {
          ...found.toObject(),
          _id: found._id.toString(),
          districtId: found.districtId.toString(),
          quarters: [],
        }
      : null;
  }
}
