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
      .emit('newEvent', event);
  }

  async newTicketPaid(payment: ICreatePaymentDto) {
    const ticket = payment.ticketId as ICreateTicketDto;

    const dataForClient: ICreateNotificationDto = {
      userId: payment.userId as string,
      title: 'Achat de billet',
      content: `Le billet pour l'événement << ${(ticket.eventId as ICreateEventDto).title} >> a été payé.`,
    };

    const dataForOrganizer: ICreateNotificationDto = {
      userId: (ticket.eventId as ICreateEventDto).ownerId as string,
      title: `Nouveau participant`,
      content: `Vous avez un nouveau participant pour l'événement << ${(ticket.eventId as ICreateEventDto).title} >>`,
    };
    const clientNotification =
      await this.notificationService.create(dataForClient);
    const organizerNotification =
      await this.notificationService.create(dataForOrganizer);

    this.server.to('client').emit('ticketPaid', payment);
    this.server
      .to(
        this.organizerConnected.get(
          (ticket.eventId as ICreateEventDto).ownerId as string,
        )?.id || '',
      )
      .emit('ticketPaid', ticket);

    this.server
      .to(this.clientConnected.get(payment.userId as string)?.id || '')
      .emit('newNotification', clientNotification);

    this.server
      .to(
        this.organizerConnected.get(
          (ticket.eventId as ICreateEventDto).ownerId as string,
        )?.id || '',
      )
      .emit('newNotification', organizerNotification);
  }
}
