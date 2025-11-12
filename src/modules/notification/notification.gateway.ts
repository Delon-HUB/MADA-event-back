import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ICreateEventDto } from '../event/dto/create-event.dto';
import { JwtService } from '@nestjs/jwt';
import { ERole } from '../../Enums/ERole';
import { ICreateTicketDto } from '../ticket/dto/create-ticket.dto';
import { ICreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import { ICreatePaymentDto } from '../payment/dto/create-payment.dto';
import { ICreateUserDto } from '../user/dto/create-user.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly logger: Logger;

  private readonly clientConnected: Map<string, Socket> = new Map<
    string,
    Socket
  >();
  private readonly organizerConnected: Map<string, Socket> = new Map<
    string,
    Socket
  >();

  constructor(
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {
    this.logger = new Logger(NotificationGateway.name);
  }

  handleConnection(client: Socket) {
    try {
      const [type, token] = client.handshake.auth?.token?.split(' ') ?? [];
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'fdsafkjfkjdsafljwlkjfl',
      });
      switch (payload.role) {
        case ERole.CLIENT:
          {
            client.join('client');
            this.clientConnected.set(payload.sub, client);
          }
          break;
        case ERole.ORGANIZER:
          {
            client.join('organizer');
            this.organizerConnected.set(payload.sub, client);
          }
          break;
      }
      this.clientConnected.set(payload.sub, client);
      this.logger.log(`${payload.sub} is connected 🟢`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const [type, token] = client.handshake.auth?.token?.split(' ') ?? [];
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'fdsafkjfkjdsafljwlkjfl',
      });
      this.clientConnected.delete(payload.sub);
      this.logger.log(`${payload.sub} is disconnected 🔴`);
    } catch (error) {}
  }

  newEventCreated(event: ICreateEventDto) {
    this.server
      .to('client')
      .to(this.organizerConnected.get(event.ownerId as string)?.id || '')
      .emit('event-created', event);
  }

  async newTicketPaid(payment: ICreatePaymentDto) {
    const ticket = payment.ticketId as ICreateTicketDto;
    const clientId = payment.userId!.toString();
    const organizerId = (ticket.eventId as ICreateEventDto).ownerId.toString();

    const dataForClient: ICreateNotificationDto = {
      userId: clientId!,
      title: 'Achat de billet',
      content: `Le billet pour l'événement << ${(ticket.eventId as ICreateEventDto).title} >> a été payé.`,
    };

    const dataForOrganizer: ICreateNotificationDto = {
      userId: organizerId,
      title: `Nouveau participant`,
      content: `Vous avez un nouveau participant pour l'événement << ${(ticket.eventId as ICreateEventDto).title} >>`,
    };
    const clientNotification =
      await this.notificationService.create(dataForClient);
    const organizerNotification =
      await this.notificationService.create(dataForOrganizer);

    this.server.to('client').emit('ticketPaid', payment);
    this.server
      .to('client')
      .to(this.organizerConnected.get(organizerId)?.id || '')
      .emit('ticket-paid', payment);

    this.server
      .to(this.clientConnected.get(clientId)?.id || '')
      .emit('notification-created', clientNotification);

    this.server
      .to(this.organizerConnected.get(organizerId)?.id || '')
      .emit('notification-created', organizerNotification);
  }

  async paymentRefunded(payment: ICreatePaymentDto) {
    const ticket: ICreateTicketDto = payment.ticketId as ICreateTicketDto;
    const clientId: string = payment.userId as string;
    const organizerId: string = (ticket.eventId as ICreateEventDto)
      .ownerId as string;

    const dataForClient: ICreateNotificationDto = {
      userId: clientId!,
      title: 'Remboursement',
      content: `Le billet pour l'événement << ${(ticket.eventId as ICreateEventDto).title} >> a été remboursé.\n
      Vous allez recévoir l'argent sur le numéro ${payment.phoneNumber}`,
    };

    const dataForOrganizer: ICreateNotificationDto = {
      userId: organizerId,
      title: `Remboursement`,
      content: `${(ticket.userId as ICreateUserDto).firstName} a été remboursé sur l'événement << ${(ticket.eventId as ICreateEventDto).title} >>`,
    };
    const clientNotification =
      await this.notificationService.create(dataForClient);
    const organizerNotification =
      await this.notificationService.create(dataForOrganizer);

    this.server
      .to(this.clientConnected.get(clientId)?.id || '')
      .emit('notification-created', clientNotification);

    this.server
      .to(this.organizerConnected.get(organizerId)?.id || '')
      .emit('notification-created', organizerNotification);

    this.server
      .to('client')
      .to(this.organizerConnected.get(organizerId)?.id || '')
      .emit('payment-refunded', payment);
  }

  async eventCancelled(event: ICreateEventDto) {
    this.server
      .to('client')
      .to(this.organizerConnected.get(event.ownerId as string)?.id || '')
      .emit('event-cancelled', event);
  }

  async eventUpdated(event: ICreateEventDto) {
    this.server
      .to('client')
      .to(this.organizerConnected.get(event.ownerId as string)?.id || '')
      .emit('event-updated', event);
  }
}
