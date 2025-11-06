export interface ICreatePaymentDto {
  _id?: string;
  eventId: string;
  userId: string;
  amount: number;
  method: string;
  phoneNumber: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
