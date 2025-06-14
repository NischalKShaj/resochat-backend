// file to set up the controller for the notification

// importing the required modules
import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationGateway: NotificationGateway) {}

  @Get('test/:userId/:message')
  async testNotification(
    @Param('userId') userId: string,
    @Param('message') message: string,
  ) {
    this.logger.log(`Sending test notification to user ${userId}`);
    this.notificationGateway.emitFriendRequestReceived(userId, message);
    return {
      success: true,
      message: `Test notification sent to user ${userId}`,
      data: { userId, message },
    };
  }
}