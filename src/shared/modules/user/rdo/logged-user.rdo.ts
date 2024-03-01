import { Expose } from 'class-transformer';
import { UserType } from '../../../models/index.js';

export class LoggedUserRdo {
  @Expose()
  public token: string;

  @Expose()
  public email: string;

  @Expose()
  public avatar: string;

  @Expose()
  public name: string;

  @Expose()
  public type: UserType;
}
