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

  async create(createPaymentDto: ICreatePaymentDto) {
    createPaymentDto.status = 'PAID';
    const newPayment = (
      await this.paymentModel.create(createPaymentDto)
    ).toObject();

    return await this.findById(newPayment._id.toString());
  }

  async findById(id: string): Promise<ICreatePaymentDto | null> {
    const payment = await this.paymentModel
      .findById(id)
      .lean()
      .populate({ path: 'userId' })
      .exec();
    return payment != null
      ? {
          ...payment,
          _id: payment._id.toString(),
          ticketId: payment.ticketId.toString(),
        }
      : payment;
  }
}
