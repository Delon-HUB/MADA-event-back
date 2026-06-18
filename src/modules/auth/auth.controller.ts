import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { ICreateUserDto } from '../user/dto/create-user.dto';
import type { ILoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: ICreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: ILoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    return await this.authService.sendOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    return await this.authService.verifyOtp(email, otp);
  }
}
