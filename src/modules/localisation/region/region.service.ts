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
    if (isAlreadyCreated)
      throw new HttpException('PROVINCE_ALREADY_EXIST', 400);
    (await new this.regionModel(region).save()).toObject();

    region.districts?.forEach(async (district) => {
      await this.districtService.create(district);
    });

    const newRegionCreated = await this.findByName(region.region.toLowerCase());
    console.log(newRegionCreated);
    return newRegionCreated!;
  }

  async findByName(regionName: string): Promise<RegionEntity | null> {
    return this.regionModel
      .findOne({ region: regionName })
      .populate(['provinceObj', 'districts'])
      .exec();
  }
}
