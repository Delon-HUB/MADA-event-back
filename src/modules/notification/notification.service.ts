import { Injectable } from '@nestjs/common';
import { NotificationEntity } from './entities/notification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationEntity.name)
    private readonly notificationModel: Model<NotificationEntity>,
  ) {}

  async create(
    newNotification: ICreateNotificationDto,
  ): Promise<ICreateNotificationDto> {
    const newNotif = (
      await this.notificationModel.create(newNotification)
    ).toObject();

    const created = {
      ...newNotif,
      _id: newNotif._id.toString(),
      userId: newNotif.userId.toString(),
    } as ICreateNotificationDto;

    return this.findById(created._id!) as Promise<ICreateNotificationDto>;
  }

  async findById(id: string): Promise<ICreateNotificationDto | null> {
    const notification = await this.notificationModel
      .findById(id)
      .lean()
      .exec();
    return notification
      ? {
          ...notification,
          _id: notification._id.toString(),
          userId: notification.userId.toString(),
        }
      : null;
  }

  async findByUserId(userId: string): Promise<ICreateNotificationDto[]> {
    const notifications = await this.notificationModel
      .find({ userId })
      .lean()
      .exec();
    return notifications.map((notification) => ({
      ...notification,
      _id: notification._id.toString(),
      userId: notification.userId.toString(),
    }));
  }
}
