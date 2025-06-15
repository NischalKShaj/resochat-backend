// file to create the gateway for the notification

// importing the required modules
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';

// setting up the socket
@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: process.env.FRONTEND_BASE_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  // handle the connection
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);

    // 1. Get the userId from the handshake query sent by the client
    const userId = client.handshake.query.userId as string;

    // 2. Check if a userId was provided
    if (userId && userId !== 'anonymous') {
      // 3. Join the client to a room named after their userId
      client.join(userId);
      console.log(
        `Client ${client.id} with userId ${userId} joined room ${userId}`,
      );
    }

    client.emit('connection', { status: 'connected' });
  }

  // handle the disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // No need to manually leave rooms, Socket.IO handles this on disconnect.
    client.emit('client-disconnected', { userId: client.id });
  }

  // emit the friend request received
  emitFriendRequestReceived(userId: string, message: string) {
    try {
      console.log(
        `[${new Date().toISOString()}] Emitting friend request to user: ${userId}`,
      );

      // This will now correctly find the client in the room "userId"
      console.log(`Attempting to emit to room: ${userId}`);
      this.server.to(userId).emit('receive-friend-request', {
        from: 'server', // The sender
        to: userId, // The intended recipient
        message,
        timestamp: new Date().toISOString(),
      });

      console.log('Friend request event emitted successfully');
    } catch (error) {
      console.error('Error in emitFriendRequestReceived:', error);
      throw error;
    }
  }
}
