import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../models/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { Request, Response } from 'express';
import { DEFAULT_OFFER_AMOUNT } from './offer.constant.js';
import { CreateOfferRequest } from './create-offer-request.type.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { UpdateOfferRequest } from './update-offer-request.type.js';
import { StatusCodes } from 'http-status-codes';


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
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getDetailedInfo }); //Get detailed offer by ID
    // TO DO:
    // this.addRoute({ path: '/premium', method: HttpMethod.Get, handler: this.getPremiumOffers });
    // this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavoritesOffers });
    // this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Put, handler: this.addOrRemoveFavorites }); //Add or remove an offer from or to favorites list

  }

  private parseToString(data: unknown): string | null {
    return typeof data === 'string' ? data : null;
  }

  // TODO: получить идентификатор пользователя и взять favorite из favoredByUsers
  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.getAllOffers(DEFAULT_OFFER_AMOUNT);
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.createOffer(body);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async update({ body, params }: UpdateOfferRequest, res: Response): Promise<void> {
    const offerId = this.parseToString(params.offerId);
    if (!offerId) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `${params.offerId} is not valid`, 'OfferController');
    }
    const existingOffer = await this.offerService.exists(offerId);

    if (!existingOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} does not exist`, 'OfferController');
    }
    const offer = await this.offerService.updateOffer(offerId, body);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params }: Request, res: Response): Promise<void> {
    const offerId = this.parseToString(params.offerId);

    if (!offerId) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `${params.offerId} is not valid`, 'OfferController');
    }

    const existingOffer = await this.offerService.exists(offerId);

    if (!existingOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} does not exist`, 'OfferController');
    }

    await this.offerService.deleteOfferById(offerId);
    this.noContent(res, null);
  }

  public async getDetailedInfo({ params }: Request, res: Response): Promise<void> {
    const existsOffer = await this.offerService.findOfferById(params.id);

    if (!existsOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with the ID:«${params.id}» does not exist.`, 'OfferController');
    }

    this.ok(res, fillDTO(OfferRdo, existsOffer));
  }

}
