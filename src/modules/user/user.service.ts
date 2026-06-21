import { HttpException, Injectable } from '@nestjs/common';
import { ICreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EError } from '../../Enums/EError';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
  ) {}

  async create(createUserDto: ICreateUserDto): Promise<ICreateUserDto> {
    const user = await this.findByEmail(createUserDto.email);
    if (user) throw new HttpException(EError.EMAIL_ALREADY_EXISTS, 400);

    const newUser = new this.userModel(createUserDto);
    const savedUser = (await newUser.save()).toObject();
    return {
      ...savedUser,
      _id: savedUser._id.toString(),
    } as ICreateUserDto;
  }

  async update(id: string, updateUserDto: Partial<ICreateUserDto>) {
    const user = await this.findById(id);
    if (!user) throw new HttpException(EError.USER_NOT_FOUND, 404);
    await this.userModel.updateOne({ _id: id }, { $set: updateUserDto }).exec();
    return this.findById(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userModel.findById(id).exec();
  }
}
