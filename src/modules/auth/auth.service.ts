import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ICreateUserDto } from '../user/dto/create-user.dto';
import { genSaltSync, hashSync } from 'bcrypt-ts';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(createUserDto: ICreateUserDto): Promise<ICreateUserDto> {
    const salt = genSaltSync(parseInt(process.env.SALT_ROUNDS + '') || 10);
    const cryptedPassword = hashSync(createUserDto.password, salt);
    createUserDto.password = cryptedPassword;
    createUserDto.otp = this.generateOtp();
    createUserDto.otpExpiry = new Date(Date.now() + 30 * 60 * 1000);
    const user: ICreateUserDto = await this.userService.create(createUserDto);
    return user;
  }

  private generateOtp(): string {
    return Math.floor(1_000 + Math.random() * 9_000).toString();
  }
}
