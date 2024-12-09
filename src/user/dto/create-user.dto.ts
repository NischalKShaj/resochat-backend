// file to create the signup dto

// importing the required modules for the validation
import { IsString, IsEmail, IsNumber, MinLength } from 'class-validator';

// creating the signup dto
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNumber()
  phoneNumber: number;
}
