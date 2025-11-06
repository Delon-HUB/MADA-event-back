export interface ICreateTicketDto {
  _id?: string;
  userId: string;
  eventId: string;
  price: number;
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentMethod?: string;
  qrCodeUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
