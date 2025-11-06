export interface ICreatePaymentDto {
  _id?: string;
  ticketId?: string;
  eventId?: string;
  userId: string;
  amount: number;
  method: string;
  phoneNumber: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
