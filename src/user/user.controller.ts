// file to create the controller for the user related access

// import the required modules
import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NotificationService } from 'src/notification/notification.service';

// controller for user
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  // controller for login
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const result = await this.userService.login(loginUserDto);
      if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result.message);
      }
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('error', error);
    }
  }

  // controller for signup
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.userService.create(createUserDto);
      console.log('result', result);
      if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      console.error('error', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json('internal server error');
    }
  }

  // controller for logout
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    try {
      console.log('logout');
      res.status(HttpStatus.OK).json('logout successfully');
    } catch (error) {
      console.error('error', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json('internal server error');
    }
  }

  // for finding the specific user by the email
  @UseGuards(JwtAuthGuard)
  @Get('search/:identifier')
  async findUser(
    @Param('identifier') identifier: string,
    @Res() res: Response,
  ) {
    try {
      console.log('findUser', identifier);
      const result = await this.userService.findUser(identifier);
      console.log('result', result);
      if (!result.success) {
        return res.status(HttpStatus.OK).json(result);
      }
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('error', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json('internal server error');
    }
  }

  // for sending a friend request
  @UseGuards(JwtAuthGuard)
  @Post('add-friend/:friendId/:userId')
  async addFriend(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
    @Res() res: Response,
  ) {
    try {
      console.log(friendId, userId);
      const result = await this.userService.sendFriendRequest(userId, friendId);
      if (!result.success) {
        return res.status(HttpStatus.ACCEPTED).json(result);
      }
      this.notificationService.sendFriendRequest(
        friendId,
        `${result.data.name} send you a friend request`,
      );
      res.status(HttpStatus.ACCEPTED).json(result);
    } catch (error) {
      console.error('error', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json('internal server error');
    }
  }

  // for deleting a user from the contact list
  @UseGuards(JwtAuthGuard)
  @Delete(':userId/contacts/:friendId')
  async removeFriend(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.userService.removeFromContact(userId, friendId);
      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      res.status(HttpStatus.ACCEPTED).json(result);
    } catch (error) {
      console.error('error', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json('internal server error');
    }
  }

  // for getting the contact list of a user
  @UseGuards(JwtAuthGuard)
  @Get(':id/contacts')
  async getContacts(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.userService.getContact(id);
      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      res.status(HttpStatus.ACCEPTED).json(result);
    } catch (error) {
      console.error('error', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json('internal server error');
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
