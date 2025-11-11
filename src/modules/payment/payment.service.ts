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
    const payment = await this.paymentModel.findById(id).lean().exec();
    return payment
      ? {
          ...payment,
          _id: payment._id!.toString(),
          userId: payment.userId.toString(),
          ticketId: payment.ticketId!.toString(),
          status: payment.status!,
        }
      : null;
  }

  async update(
    id: string,
    data: Partial<ICreatePaymentDto>,
  ): Promise<ICreatePaymentDto | null> {
    await this.paymentModel.findByIdAndUpdate(id, data).lean().exec();
    return this.findById(id);
  }
}
