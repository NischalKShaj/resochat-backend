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
    client.emit('connection', { status: 'connected' });
  }

  // handle the disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    client.emit('client-disconnected', { userId: client.id });
  }

  // emit the friend request received
  emitFriendRequestReceived(userId: string, message: string) {
    try {
      console.log(
        `[${new Date().toISOString()}] Emitting friend request to user: ${userId}`,
      );

      // Get all rooms (safer way)
      // const rooms = Array.from(this.server.sockets.adapter.rooms || []);
      // console.log('All rooms:', rooms);

      // Emit to specific room
      console.log(`Attempting to emit to room: ${userId}`);
      this.server.to(userId).emit('receive-friend-request', {
        from: 'server',
        to: userId,
        message,
        timestamp: new Date().toISOString(),
      });

      console.log('Friend request event emitted successfully');
    } catch (error) {
      console.error('Error in emitFriendRequestReceived:', error);
      throw error;
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log(
        `[${new Date().toISOString()}] User ${client.id} joining room: ${userId}`,
      );

      // Join the room
      client.join(userId);

      // Get list of rooms this socket is in
      const rooms = Array.from(client.rooms || []);
      console.log(`User ${client.id} is now in rooms:`, rooms);

      // Send confirmation to client
      client.emit('room-joined', {
        success: true,
        room: userId,
        clientId: client.id,
        timestamp: new Date().toISOString(),
        message: `Successfully joined room ${userId}`,
      });

      console.log(`User ${client.id} successfully joined room ${userId}`);
    } catch (error) {
      console.error('Error in handleJoinRoom:', error);
      client.emit('error', {
        success: false,
        message: error.message || 'Failed to join room',
      });
    }
  }
}
