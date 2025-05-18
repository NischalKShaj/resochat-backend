// file to create the schema for the chat

// importing the required modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiver: Types.ObjectId;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
