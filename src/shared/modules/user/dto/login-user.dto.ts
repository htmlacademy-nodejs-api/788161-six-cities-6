import { IsEmail, IsString } from 'class-validator';
import { CREATE_LOGIN_USER_MESSAGES } from './login-user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: CREATE_LOGIN_USER_MESSAGES.EMAIL.INVALID_FORMAT })
  public email: string;

  @IsString({ message: CREATE_LOGIN_USER_MESSAGES.PASSWORD.INVALID_FORMAT })
  public password: string;
}
