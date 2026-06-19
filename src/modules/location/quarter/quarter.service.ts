import { Injectable } from '@nestjs/common';
import { IQuarter } from './dto/quarter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuarterEntity } from './entities/quarter.entity';
import { Model } from 'mongoose';
import { ICommune } from '../commune/dto/commune.dto';

@Injectable()
export class QuarterService {
  constructor(
    @InjectModel(QuarterEntity.name)
    private readonly quarterModel: Model<QuarterEntity>,
  ) {}

  async create(data: IQuarter): Promise<IQuarter> {
    const created = (await this.quarterModel.create(data)).toObject();
    return {
      ...created,
      _id: created._id.toString(),
      communeId: created.communeId.toString(),
    };
  }

  async findByName(name: string): Promise<IQuarter[]> {
    const result = await this.quarterModel
      .find({ name: { $regex: `^${name}`, $options: 'i' } }, {}, { limit: 20 })
      .populate({
        path: 'communeId',
        populate: {
          path: 'districtId',
          populate: {
            path: 'regionId',
          },
        },
      })
      .lean()
      .exec();
    return result.map((q) => ({
      ...q,
      _id: q._id.toString(),
      communeId: q.communeId as unknown as ICommune,
    }));
  }

  async findAll(): Promise<IQuarter[]> {
    const quarters = await this.quarterModel.find().exec();
    return quarters.map((q) => ({
      ...q.toObject(),
      _id: q._id.toString(),
      communeId: q.communeId.toString(),
    }));
  }

  async findByCommuneId(communeId: string): Promise<IQuarter[]> {
    const quarters = await this.quarterModel.find({ communeId }).exec();
    return quarters.map((q) => ({
      ...q.toObject(),
      _id: q._id.toString(),
      communeId: q.communeId.toString(),
    }));
  }

  async findById(_id: string): Promise<IQuarter | null> {
    const found = await this.quarterModel.findById({ _id }).exec();
    return found
      ? {
          ...found.toObject(),
          _id: found._id.toString(),
          communeId: found.communeId.toString(),
        }
      : null;
  }
}
