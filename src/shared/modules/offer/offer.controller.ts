import { inject, injectable } from 'inversify';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../models/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { Request, Response } from 'express';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';
import { StatusCodes } from 'http-status-codes';
import { ParamOfferId } from './type/param-offerid.type.js';
import { DEFAULT_OFFER_AMOUNT, DEFAULT_OFFER_PREMIUM_COUNT } from './offer.constant.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/index.js';
import { CreateOfferDto, UpdateOfferDto } from './index.js';


@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);
    this.logger.info('Refister routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavoritesOffers
    });

    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Put,
      handler: this.favorite,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });

  }

  public async getFavoritesOffers(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'OfferController');
  }

  public favorite(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'OfferController');
  }

  public async getPremiumOffers({ query }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.getPremiumOffersByCity(query.city as string, DEFAULT_OFFER_PREMIUM_COUNT);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }


  // TODO: получить идентификатор пользователя и взять favorite из favoredByUsers
  // TO DO добавить лимиты
  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.getAllOffers(DEFAULT_OFFER_AMOUNT);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }


  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.createOffer(body);
    const offer = await this.offerService.findOfferById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async update({ params, body }: UpdateOfferRequest, res: Response): Promise<void> {
    await this.offerService.updateOffer(params.offerId, body);
    const updatedOffer = await this.offerService.findOfferById(params.offerId);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    await this.offerService.deleteOfferById(offerId);
    await this.commentService.deleteCommentByOfferId(offerId);
    this.noContent(res, null);
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findCommentByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findOfferById(offerId);

    this.ok(res, fillDTO(OfferRdo, offer));
  }
}
