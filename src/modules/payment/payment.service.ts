import { Injectable } from '@nestjs/common';
import { ICreatePaymentDto } from './dto/create-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentEntity } from './entities/payment.entity';
import { Model } from 'mongoose';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(PaymentEntity.name)
    private readonly paymentModel: Model<PaymentEntity>,
  ) {}

  async create(
    createPaymentDto: ICreatePaymentDto,
  ): Promise<ICreatePaymentDto> {
    // get event by id
    const newPayment = (
      await this.paymentModel.create(createPaymentDto)
    ).toObject();
    newPayment.status = 'paid';
    return {
      ...newPayment,
      _id: newPayment._id.toString(),
      eventId: newPayment.eventId.toString(),
      userId: newPayment.userId.toString(),
    };
  }
}
