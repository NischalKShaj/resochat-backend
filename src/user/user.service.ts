import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // for the login purpose
  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userModel.findOne({ email: loginUserDto.email });
      console.log('user', user);
      if (!user) {
        return { success: false, message: 'user not found' };
      }
      const password = bcrypt.compare(loginUserDto.password, user.password);
      console.log('password', password);
      if (!password) {
        return { success: false, message: 'password not matching' };
      }

      const payload = { userId: user._id, email: user.email };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '72h',
      });

      return { user: user, success: true, token: token };
    } catch (error) {
      console.error('error', error);
      return { success: false, message: 'internal server error' };
    }
  }

  // for creating new user
  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);

      const existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (existingUser) {
        return { success: false, message: 'user already exists' };
      }
      const newUser = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      return {
        data: savedUser,
        message: 'user saved successfully',
        success: true,
      };
    } catch (error) {
      console.error('error', error);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
