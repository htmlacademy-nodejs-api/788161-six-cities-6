import { Request, Response, NextFunction } from 'express';
import { OfferService } from '../../../modules/offer/offer-service.interface.js';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';


export class ValidateUserMiddleware implements Middleware {
  constructor(
    private readonly offerService: OfferService,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({ params, tokenPayload}: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];

    if (!(await this.offerService.isAuthor(tokenPayload.id, documentId))) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `Action is forbidden for ${this.entityName}`,
        'ValidateAuthorMiddleware',
      );
    }

    next();
  }
}
