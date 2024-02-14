import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto, UpdateUserDto, UserEntity } from './index.js';
import { UserService } from './user-service.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../models/component.enum.js';
import { Logger } from '../../libs/logger/index.js';


@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById({id});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, {new: true})
      .populate(['favorites'])
      .exec();
  }

  public async addOfferToFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $push: { favorites: offerId } },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      this.logger.info('Error adding offer to favorites');
      return null;
    }
  }

  public async removeOfferFromFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $pull: { favorites: offerId } },
        { new: true }
      );

      return updatedUser;
    } catch (error) {
      this.logger.info('Error removing offer from favorites:');
      return null;
    }
  }

}
