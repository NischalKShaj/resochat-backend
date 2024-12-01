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
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

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
