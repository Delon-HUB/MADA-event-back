import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ICreateUserDto } from '../user/dto/create-user.dto';
import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';
import { LoginDto } from './dto/login.dto';
import { EError } from '../../Enums/EError';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: ICreateUserDto): Promise<ICreateUserDto> {
    const salt = genSaltSync(parseInt(process.env.SALT_ROUNDS + '') || 10);
    const cryptedPassword = hashSync(createUserDto.password, salt);
    createUserDto.password = cryptedPassword;
    createUserDto.otp = this.generateOtp();
    createUserDto.otpExpiry = new Date(Date.now() + 30 * 60 * 1000);
    const user: ICreateUserDto = await this.userService.create(createUserDto);
    return user;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; verified: boolean }> {
    const user: ICreateUserDto | null = await this.userService.findByEmail(
      loginDto.email,
    );
    if (!user) throw new HttpException(EError.USER_NOT_FOUND, 404);
    const isPasswordValid = compareSync(loginDto.password, user.password);
    if (!isPasswordValid) throw new HttpException(EError.WRONG_PASSWORD, 401);
    const payload = { sub: user._id, createdAt: user.createdAt };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET + '' || 'fdsafkjfkjdsafljwlkjfl',
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN + '') || '1h',
      }),
      verified: user.verified,
    };
  }

  private generateOtp(): string {
    return Math.floor(1_000 + Math.random() * 9_000).toString();
  }
}
