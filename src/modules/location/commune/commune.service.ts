import { Injectable } from '@nestjs/common';
import { ICommune } from './dto/commune.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CommuneEntity } from './entities/commune.entity';
import { Model } from 'mongoose';

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

  async findAll(): Promise<ICommune[]> {
    const communes = await this.communeModel.find().exec();
    return communes.map((c) => ({
      ...c.toObject(),
      _id: c._id.toString(),
      districtId: c.districtId.toString(),
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
}
