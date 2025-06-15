// file to create the schema for the notification

// importing the required modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationType } from '../notification-type.enum';

// creating the schema
@Schema()
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false, required: true })
  isRead: boolean;

  @Prop({ default: new Date(), required: true })
  createdAt: Date;
}

// exporting the schema
export const notificationSchmea = SchemaFactory.createForClass(Notification);
