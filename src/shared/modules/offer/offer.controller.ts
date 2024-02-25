import { inject, injectable } from 'inversify';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
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
import { ParamOfferId } from './type/param-offerid.type.js';
import { DEFAULT_OFFER_AMOUNT, DEFAULT_OFFER_PREMIUM_COUNT, MAX_OFFER_AMOUNT } from './offer.constant.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/index.js';
import { CreateOfferDto, UpdateOfferDto } from './index.js';
import { FavoriteOfferDto } from './dto/favorite-offer.dto.js';
import { FavoriteOfferRequest } from './type/favorite-offer-request.type.js';
import { UserService } from '../user/index.js';


@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService
  ) {
    super(logger);
    this.logger.info('Refister routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavoritesOffers,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        // TO DO определить что авторизованный пользователь - автор
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        // TO DO определить что авторизованный пользователь - автор
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
      path: '/:offerId/favorite',
      method: HttpMethod.Put,
      handler: this.favorite,
      middlewares: [
        new PrivateRouteMiddleware(), // +
        new ValidateObjectIdMiddleware('offerId'), // +
        new ValidateDtoMiddleware(FavoriteOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

  }

  public async getFavoritesOffers({tokenPayload: { id }}: Request, res: Response): Promise<void> {
    const offers = await this.offerService.getAllFavoriteOffersByUser(id);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async favorite({body, params, tokenPayload: { id, email } }: FavoriteOfferRequest, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(email);
    const favorites = new Set(user?.favorites.map((item) => item.id));
    console.log('PARAMS 11', params);
    console.log('favorites 11', favorites);
    if (body.favorites) {
      favorites.add(params.offerId);
    } else {
      favorites.delete(params.offerId);
    }

    await this.userService.updateById(id, {favorites: [...favorites]});
    this.noContent(res, null);
  }

  public async getPremiumOffers({ query }: Request, res: Response): Promise<void> { // TO DO tokenPayload
    const offers = await this.offerService.getPremiumOffersByCity(query.city as string, DEFAULT_OFFER_PREMIUM_COUNT); // TO DO pass tokenPayload?.id
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }


  // TODO: получить идентификатор пользователя и взять favorite из favoredByUsers
  public async index({ query, tokenPayload }: Request, res: Response): Promise<void> { // TO DO tokenPayload
    const limit = Number.parseInt(query.limit as string, 10);
    const amount = Math.max(
      Math.min(limit || 0, MAX_OFFER_AMOUNT),
      DEFAULT_OFFER_AMOUNT
    );
    const offers = await this.offerService.getAllOffers(tokenPayload?.id, amount); // TO DO tokenPayload?.id,
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }


  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const createdOffer = await this.offerService.createOffer({
      ...body,
      authorId: tokenPayload.id
    });
    const offer = await this.offerService.findOfferById(tokenPayload.id, createdOffer.id); // TO DO pass tokenPayload.id
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async update({ params, body, tokenPayload }: UpdateOfferRequest, // TO DO tokenPayload
    res: Response
  ): Promise<void> {
    await this.offerService.updateOffer(params.offerId, body);
    const updatedOffer = await this.offerService.findOfferById(tokenPayload.id, params.offerId); // TO DO pass tokenPayload.id

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    await this.offerService.deleteOfferById(offerId);
    await this.commentService.deleteCommentByOfferId(offerId);
    this.noContent(res, null);
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findCommentByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async show({ params: { offerId}, tokenPayload}: Request<ParamOfferId>, // TO DO tokenPayload
    res: Response): Promise<void> {
    const offer = await this.offerService.findOfferById(tokenPayload?.id, offerId); // TO DO pass tokenPayload?.id

    this.ok(res, fillDTO(OfferRdo, offer));
  }
}
