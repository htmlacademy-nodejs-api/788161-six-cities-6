import { Container } from 'inversify';
import { UserService } from './user-service.interface.js';
import { Component } from '../../models/index.js';
import { DefaultUserService } from './default-user.service.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  return userContainer;
}
