import { inject, injectable } from 'inversify';
import { Component } from '../../models/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, HttpError, HttpMethod, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Request, Response } from 'express';
import { CreateUserRequest } from './create-user-request.type.js';
import { CreateUserDto, UserService } from './index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { LoginUserDto } from './dto/login-user.dto.js';


@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Refister routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });

    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthToken
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ],
    });
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }

  public async login(
    { body }: LoginUserRequest,
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async create({ body }: CreateUserRequest, res: Response): Promise<void> {
    const isExistingUser = await this.userService.findByEmail(body.email);

    if (isExistingUser) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email "${body.email}" already exists.`, 'UserController');
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async checkAuthToken(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  public async logout(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }
}

