import { UserType } from '../../../models/index.js';

export class UpdateUserDto {
  public avatar?: string;
  public name?: string;
  public userType?: UserType;
  public favorites?: string[];
}
