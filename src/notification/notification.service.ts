// for creating the service for the notifications

// importing the required modules
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { Socket } from 'socket.io';

// setting up the services
@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) {}

  // setting the service for the friend req send
  async sendFriendRequest(userId: string, message: string) {
    this.notificationGateway.emitFriendRequestReceived(userId, message);
    return { success: true };
  }
}
