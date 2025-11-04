import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(EventGateway.name);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`${client.id} is connected`);
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`${client.id} is disconnected`);
  }
}
