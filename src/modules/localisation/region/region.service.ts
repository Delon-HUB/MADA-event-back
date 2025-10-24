import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegionEntity } from './entities/region.entity';
import { Model } from 'mongoose';
import { ICreateRegionDto } from './dto/create-region.dto';
import { DistrictService } from '../district/district.service';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(RegionEntity.name)
    private readonly regionModel: Model<RegionEntity>,
    private readonly districtService: DistrictService,
  ) {}

  async create(region: ICreateRegionDto): Promise<ICreateRegionDto> {
    const isAlreadyCreated = (await this.findByName(region.region)) != null;
    if (isAlreadyCreated) throw new HttpException('REGION_ALREADY_EXIST', 400);
    const created = await this.regionModel.create(region);
    return {
      ...created,
      provinceId: created.provinceId.toString(),
      districtIds: created.districtIds.map((district) => district.toString()),
      _id: created._id.toString(),
    };
  }

  async findByName(regionName: string): Promise<RegionEntity | null> {
    return await this.regionModel
      .findOne({ region: regionName })
      .populate(['provinceObj', 'districts'])
      .exec();
  }
}
