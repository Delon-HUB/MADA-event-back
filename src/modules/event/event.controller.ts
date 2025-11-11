import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  Request,
  Param,
} from '@nestjs/common';
import { EventService } from './event.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ICreateEventDto } from './dto/create-event.dto';
import { diskStorage } from 'multer';
import { NotificationGateway } from '../notification/notification.gateway';
import type { Request as Req } from 'express';
import { EError } from '../../Enums/EError';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../../interfaces/IJwtPayload';
import { ERole } from '../../Enums/ERole';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly jwtService: JwtService,
    private readonly notificationGateway: NotificationGateway,
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
    const payload = this.getPayload(req);
    data.ownerId = payload.sub;
    if (img) data.photo = img.path;
    const newEvent = await this.eventService.create(data);
    this.notificationGateway.newEventCreated(newEvent);
    return newEvent;
  }

  @Get()
  async findAll(@Request() req: Req) {
    const payload = this.getPayload(req);
    if (payload.role == ERole.ORGANIZER)
      return await this.eventService.findByOwnerId(payload.sub);
    else if (payload.role == ERole.CLIENT) {
      const all = await this.eventService.findAll();
      return all.filter((e) => e.status == 'UPCOMING' || e.status == 'ONGOING');
    } else return await this.eventService.findAll();
  }

  @Get(':eventId')
  async getById(@Param('eventId') eventId: string) {
    return await this.eventService.findById(eventId);
  }

  @Post('/mine')
  async getByUserId(@Request() req: Req) {
    const payload = this.getPayload(req);
    if (payload?.sub) return await this.eventService.findByOwnerId(payload.sub);
  }

  private getPayload(request: Req): IJwtPayload {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (!(type && token)) throw new UnauthorizedException(EError.TOKEN_INVALID);
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET || 'fdsafkjfkjdsafljwlkjfl',
    });
    if (!payload.sub) throw new UnauthorizedException(EError.TOKEN_EXPIRED);
    return payload;
  }

  @Get('hello')
  sayHello() {
    return 'hello';
  }
}
