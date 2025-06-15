// for creating the service for the notifications

// importing the required modules
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { Socket } from 'socket.io';
import { NotificationType } from './notification-type.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';

// setting up the services
@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => NotificationGateway))
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  // setting the service for the friend req send
  async sendFriendRequest(userId: string, message: string) {
    this.notificationGateway.emitFriendRequestReceived(userId, message);
    return { success: true };
  }

  // for adding the notification to the database
  async createNotification(data: {
    senderId: string;
    receiverId: string;
    type: NotificationType;
    message: string;
  }) {
    try {
      const notification = await this.notificationModel.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        type: data.type,
        message: data.message,
        isRead: false,
        createdAt: new Date(),
      });

      const savedNotification = await notification.save();

      if (!savedNotification) {
        throw new Error('somethings wrong while inserting the notification');
      }

      return { success: true, message: 'notification created successfully' };
    } catch (error) {
      console.error('error from the create notification', error);
      return { success: false, message: 'internal server error' };
    }
  }
}
