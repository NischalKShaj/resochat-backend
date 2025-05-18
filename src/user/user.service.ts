// import the required modules
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
// import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  // for the login purpose
  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userModel.findOne({ email: loginUserDto.email });
      console.log('user', user);
      if (!user) {
        return { success: false, message: 'user not found' };
      }
      const password = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      console.log('password', password);
      if (!password) {
        return { success: false, message: 'password not matching' };
      }

      const payload = { userId: user._id, email: user.email };

      const token = this.authService.generateToken(payload);

      return { user: user, success: true, token: token };
    } catch (error) {
      console.error('error', error);
      return { success: false, message: 'internal server error' };
    }
  }

  // for creating new user
  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hashSync(createUserDto.password, 10);

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
      return { success: false, message: 'internal server error' };
    }
  }

  // for searching and finding the user
  async findUser(identifier: string) {
    try {
      const user = await this.userModel.findOne({
        $or: [
          { email: new RegExp('^' + identifier + '$', 'i') },
          { user: new RegExp('^' + identifier + '$', 'i') },
        ],
      });
      if (!user) {
        return { success: false, message: 'user not found' };
      }
      return { data: user, success: true, message: 'user found' };
    } catch (error) {
      console.error('error', error);
      return { success: false, message: 'internal server error' };
    }
  }

  // for adding the user to the contact list
  async addContact(userId: string, friendId: string) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        return { success: false, message: 'user not found' };
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(
        { _id: userId },
        { $addToSet: { contacts: friendId } },
        { new: true },
      );
      if (!updatedUser) {
        return { success: false, message: 'updating failed' };
      }
      return {
        data: updatedUser,
        success: true,
        message: 'friend added to the user',
      };
    } catch (error) {
      console.error('error', error);
      return { success: false, message: 'internal server error' };
    }
  }

  // for removing the user from the contact list
  async removeFromContact(userId: string, friendId: string) {
    try {
      const user = await this.userModel.findById({ _id: userId });
      if (!user) {
        return { success: false, message: 'user not found' };
      }
      const updatedUser = await this.userModel.findByIdAndUpdate(
        { _id: userId },
        { $pull: { contacts: friendId } },
        { new: true },
      );
      if (!updatedUser) {
        return { success: false, message: 'user not removed' };
      }
      return {
        data: updatedUser,
        message: 'user removed from the contact',
        success: true,
      };
    } catch (error) {
      console.error('error', error);
      return { success: false, message: 'internal server error' };
    }
  }

  // for getting the contact list of the users
  async getContact(id: string) {
    try {
      const user = await this.userModel
        .findById({ _id: id })
        .populate('contacts');

      if (!user) {
        return { success: false, message: 'user not found' };
      }
      return {
        data: user.contacts,
        message: 'user contact list',
        success: true,
      };
    } catch (error) {
      console.error('error', error);
      return { success: false, message: 'internal server error' };
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
