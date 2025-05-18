// file for the 1-1 chat controller

// importing the required modules
import {
  Controller,
  //   Get,
  Post,
  //   Patch,
  Body,
  //   Delete,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async sendMessage(@Body() messageDto: any, @Res() res: Response) {
    try {
      res.status(HttpStatus.ACCEPTED).json();
    } catch (error) {
      console.error('error', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
