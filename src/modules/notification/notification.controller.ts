import { Controller, Post, UnauthorizedException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EError } from '../../Enums/EError';
import { JwtService } from '@nestjs/jwt';
import { Request } from '@nestjs/common';
import { type Request as Req } from 'express';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/mine')
  async getByUserId(@Request() req: Req) {
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new UnauthorizedException(EError.TOKEN_INVALID);
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'fdsafkjfkjdsafljwlkjfl',
      });
      if (!payload.sub) throw new UnauthorizedException(EError.TOKEN_EXPIRED);
      return await this.notificationService.findByUserId(payload.sub);
    } catch (error) {
      console.error(error);
    }
  }

  private extractTokenFromHeader(request: Req): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
