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

// controller for user
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // controller for login
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const result = await this.userService.login(loginUserDto);
      if (!result.success) {
        console.log('inside');
        res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      res.status(HttpStatus.ACCEPTED).json(result);
    } catch (error) {
      console.error('error', error);
    }
  }

  // controller for signup
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.userService.create(createUserDto);
      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json(result);
      }
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      console.error('error', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json('internal server error');
    }
  }

  // for finding the specific user by the email
  @UseGuards(JwtAuthGuard)
  @Get('search/:email')
  async findUser(@Param('email') email: string, @Res() res: Response) {
    try {
      const result = await this.userService.findUser(email);
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

  // for adding a user to the contact list
  @UseGuards(JwtAuthGuard)
  @Post(':userId/contacts/:friendId')
  async addContact(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.userService.addContact(userId, friendId);
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
