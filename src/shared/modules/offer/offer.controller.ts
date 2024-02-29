import { inject, injectable } from 'inversify';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
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
import {
  DEFAULT_OFFER_AMOUNT,
  OFFER_PREMIUM_COUNT,
  MAX_OFFER_AMOUNT,
  OFFER_IMAGES_AMOUNT,
  ALLOWED_IMAGE_TYPES,
} from './offer.constant.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CommentRdo } from '../comment/index.js';
import { CreateOfferDto, UpdateOfferDto } from './index.js';
import { FavoriteOfferDto } from './dto/favorite-offer.dto.js';
import { FavoriteOfferRequest } from './type/favorite-offer-request.type.js';
import { UserService } from '../user/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { UploadImagesRdo } from './rdo/upload-images.rdo.js';
import { StatusCodes } from 'http-status-codes';


@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
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
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
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
      handler: this.toggleFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(FavoriteOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        // TO DO определить что авторизованный пользователь - автор
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image',
          ALLOWED_IMAGE_TYPES,
          OFFER_IMAGES_AMOUNT)
      ]
    });
  }

  public async getFavoritesOffers({tokenPayload: { id }}: Request, res: Response): Promise<void> {
    const offers = await this.offerService.getAllFavoriteOffersByUser(id);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async toggleFavorite({ body, params, tokenPayload: { id, email } }: FavoriteOfferRequest, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(email);
    const offerId: string = params.offerId as string;
    const favorites = new Set<string>(user!.favorites.map((item) => item._id.toString()));

    if (body.favorites) {
      favorites.add(offerId);
    } else {
      favorites.delete(offerId);
    }
    await this.userService.updateById(id, { favorites: Array.from(favorites) });
    this.noContent(res, null);
  }


  public async getPremiumOffers({ query, tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.getPremiumOffersByCity(
      tokenPayload?.id,
      query.city as string,
      OFFER_PREMIUM_COUNT
    );
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }


  public async index({ query, tokenPayload }: Request, res: Response): Promise<void> {
    const limit = Number.parseInt(query.limit as string, 10);
    const amount = Math.max(
      Math.min(limit || 0, MAX_OFFER_AMOUNT),
      DEFAULT_OFFER_AMOUNT
    );
    const offers = await this.offerService.getAllOffers(tokenPayload?.id, amount);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }


  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const createdOffer = await this.offerService.createOffer({
      ...body,
      authorId: tokenPayload.id
    });
    const offer = await this.offerService.findOfferById(tokenPayload.id, createdOffer.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async update({ params, body, tokenPayload }: UpdateOfferRequest,
    res: Response
  ): Promise<void> {
    await this.offerService.updateOffer(params.offerId, body);
    const updatedOffer = await this.offerService.findOfferById(tokenPayload.id, params.offerId);

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

  public async getComments(
    { params }: Request<ParamOfferId>,res: Response): Promise<void> {
    const comments = await this.commentService.findCommentByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async show({ params: { offerId }, tokenPayload }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findOfferById(tokenPayload?.id, offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async uploadImages({ params, files }: Request<ParamOfferId>, res: Response) {
    if (!Array.isArray(files)) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'No files uploaded');
    }
    const { offerId } = params;
    const housingPhotos = files?.map((file) => file.filename) ?? [];
    const updateDto = {
      housingPhotos: housingPhotos
    };
    await this.offerService.updateOffer(offerId, updateDto);
    this.created(res, fillDTO(UploadImagesRdo, updateDto));
  }
}
