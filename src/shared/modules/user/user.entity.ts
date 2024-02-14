import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User, UserType } from '../../models/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { OfferEntity } from '../offer/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, default: ''})
  public name: string;

  @prop({unique: true, require: true})
  public email: string;

  @prop({default: '', require: false})
  public avatar: string;

  @prop({required: true, default: ''})
  private password?: string;

  @prop({ enum: UserType, default: UserType.Ordinary, required: true })
  public userType!: UserType;

  @prop({
    required: true,
    ref: 'OfferEntity',
    default: [],
  })
  public favorites: Ref<OfferEntity>[];

  constructor(userData: User) {
    super();
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
