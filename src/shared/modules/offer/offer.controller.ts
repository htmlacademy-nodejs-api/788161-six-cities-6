import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
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
import { DEFAULT_OFFER_AMOUNT } from './offer.constant.js';


@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);
    this.logger.info('Refister routes for OfferController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update }); //Update offer by ID
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete }); //Delete offer by ID
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show }); //Get detailed offer by ID
    // TO DO:
    // this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremiumOffers });
    // this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavoritesOffers });
    // this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Put, handler: this.addOrRemoveFavorites }); //Add or remove an offer from or to favorites list

  }

  // TODO: получить идентификатор пользователя и взять favorite из favoredByUsers
  // TO DO добавить лимиты
  public async index(_req: Request, res: Response): Promise<void> { //<RequestQuery>
    const offers = await this.offerService.getAllOffers(DEFAULT_OFFER_AMOUNT);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.createOffer(body);
    const offer = await this.offerService.findOfferById(result.id);
    // to do check: result = await this.offerService.createOffer(body);this.created(res, fillDTO(OfferRdo, result));
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async update({ params, body }: UpdateOfferRequest, res: Response): Promise<void> {
    // const { offerId } = params;
    await this.offerService.updateOffer(params.offerId, body);
    const updatedOffer = await this.offerService.findOfferById(params.offerId);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    await this.offerService.deleteOfferById(offerId);
    // to do:
    // await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, null);
  }

  public async show({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findOfferById(offerId);

    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with the ID:«${offerId}» does not exist.`, 'OfferController');
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }
}
