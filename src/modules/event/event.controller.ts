import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { EventService } from './event.service';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';
import { ICreateEventDto } from './dto/create-event.dto';
import { diskStorage } from 'multer';
import { EventGateway } from './event.gateway';
import { ERole } from '../../Enums/ERole';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly eventGateway: EventGateway,
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
  ) {
    data.photo = img.path;
    const newEvent = await this.eventService.create(data);
    this.eventGateway.newEventCreated(newEvent);
    return newEvent;
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }
}
