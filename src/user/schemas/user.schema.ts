// file to create the schema

// importing the required modules
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// schema for the user
@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({
    required: true,
    default:
      'https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg',
  })
  profileImage: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  contacts: Types.ObjectId[];

  @Prop({ type: [{
    type: Types.ObjectId,
    ref: 'User',
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    timestamp: { type: Date, default: Date.now }
  }] })
  friendRequests: {
    userId: Types.ObjectId,
    status: string,
    timestamp: Date
  }[];
}

export const userSchema = SchemaFactory.createForClass(User);
