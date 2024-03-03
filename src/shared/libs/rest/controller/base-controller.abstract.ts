import { inject, injectable } from 'inversify';
import { Controller } from './controller.interface.js';
import { Response, Router } from 'express';
import { Logger } from '../../logger/index.js';
import { Route } from '../types/route.interface.js';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import { PathTransformer } from '../transform/path-transformer.js';
import { Component } from '../../../models/index.js';
import { DEFAULT_CONTENT_TYPE } from './controller.constant.js';

@injectable()
export abstract class BaseController implements Controller {
  private readonly exptessRouter: Router = Router();
  @inject(Component.PathTransformer) private pathTransformer: PathTransformer;

  constructor(
    protected readonly logger: Logger
  ) {}

  get router() {
    return this.exptessRouter;
  }

  public addRoute(route: Route) {
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));
    const middlewareHandlers = route.middlewares?.map(
      (item) => asyncHandler(item.execute.bind(item))
    );
    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;
    this.exptessRouter[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTransformer.execute(data as Record<string, unknown>);
    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(modifiedData);
  }

  public created<T>(res: Response, data:T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data:T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data:T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
