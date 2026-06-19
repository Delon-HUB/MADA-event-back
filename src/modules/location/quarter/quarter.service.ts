import { Injectable } from '@nestjs/common';
import { IQuarter } from './dto/quarter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuarterEntity } from './entities/quarter.entity';
import { Model } from 'mongoose';

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
}
