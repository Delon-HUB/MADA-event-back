import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ICreateEventDto } from './dto/create-event.dto';
import { diskStorage } from 'multer';
import { EventGateway } from './event.gateway';
import type { Request as Req } from 'express';
import { EError } from '../../Enums/EError';
import { JwtService } from '@nestjs/jwt';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly eventGateway: EventGateway,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/event',
        filename: (req, file, cb) => {
          const filename =
            'event-' + Date.now() + `.${file.mimetype.split('/')[1]}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() img: Express.Multer.File,
    @Body() data: ICreateEventDto,
    @Request() req: Req,
  ) {
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new UnauthorizedException(EError.TOKEN_INVALID);
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'fdsafkjfkjdsafljwlkjfl',
      });
      console.log(payload);
      if (!payload.sub) throw new UnauthorizedException(EError.TOKEN_EXPIRED);

      data.owner = payload.sub;
      data.photo = img.path;
      const newEvent = await this.eventService.create(data);
      this.eventGateway.newEventCreated(newEvent);
      return newEvent;
    } catch (error) {
      throw new UnauthorizedException(EError.TOKEN_EXPIRED);
    }
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  private extractTokenFromHeader(request: Req): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
