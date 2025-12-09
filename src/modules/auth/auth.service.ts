import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ICreateUserDto } from '../user/dto/create-user.dto';
import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';
import { LoginDto } from './dto/login.dto';
import { EError } from '../../Enums/EError';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { IJwtPayload } from '../../interfaces/IJwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  async register(createUserDto: ICreateUserDto): Promise<ICreateUserDto> {
    const salt = genSaltSync(parseInt(process.env.SALT_ROUNDS + '') || 10);
    const cryptedPassword = hashSync(createUserDto.password, salt);
    createUserDto.password = cryptedPassword;
    createUserDto.otp = this.generateOtp();
    createUserDto.otpExpiry = new Date(Date.now() + 30 * 60 * 1000);
    const user: ICreateUserDto = await this.userService.create(createUserDto);
    await this.mailService.sendOtp(user.email, user.otp!);
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
    const payload: IJwtPayload = {
      sub: user._id!,
      role: user.role,
    };
    return {
      accessToken: await this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET + '' || 'fdsafkjfkjdsafljwlkjfl',
        expiresIn: '1d',
      }),
      verified: user.verified,
    };
  }

  async sendOtp(
    email: string,
  ): Promise<{ verified: boolean; message: string }> {
    const user: ICreateUserDto | null =
      await this.userService.findByEmail(email);
    if (!user) throw new HttpException(EError.USER_NOT_FOUND, 404);
    const otp = this.generateOtp();
    await this.userService.update(user._id!, {
      otp,
      otpExpiry: new Date(Date.now() + 30 * 60 * 1000),
      verified: false,
    });
    await this.mailService.sendOtp(user.email, otp);
    return {
      verified: false,
      message: `OTP sent to ${email}. It is valid for 30 minutes.`,
    };
  }

  async verifyOtp(email: string, otp: string) {
    const user: ICreateUserDto | null =
      await this.userService.findByEmail(email);
    if (!user) throw new HttpException(EError.USER_NOT_FOUND, 404);
    if (user.otp !== otp) throw new HttpException(EError.INVALID_OTP, 400);
    if (user.otpExpiry && user.otpExpiry < new Date())
      throw new HttpException(EError.OTP_EXPIRED, 400);

    user.otp = null;
    user.otpExpiry = null;
    user.verified = true;
    await this.userService.update(user._id!, user);
    return { verified: true };
  }

  private generateOtp(): string {
    return Math.floor(1_000 + Math.random() * 9_000).toString();
  }
}
