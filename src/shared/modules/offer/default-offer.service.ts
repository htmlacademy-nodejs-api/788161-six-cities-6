import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../models/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, mongoose, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './index.js';
import { DEFAULT_OFFER_AMOUNT, OFFER_PREMIUM_COUNT } from './offer.constant.js';
import { SortOrder } from '../../models/sort-type.enum.js';
import {
  authorPipeline,
  commentsPipeline,
  defaultPipeline,
  getPipeline,
} from './offer.aggregation.js';
import { UserEntity } from '../user/user.entity.js';
import { UploadOfferImagesDto } from './dto/upload-offer-images.dto.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ){}

  public async createOffer(
    dto: CreateOfferDto
  ): Promise<types.DocumentType<OfferEntity>> {
    const offer = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}.`);

    return offer;
  }

  public async findOfferById(
    userId: string | undefined,
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $toObjectId: '$_id' }, { $toObjectId: offerId }]
          }
        }
      },
      ...getPipeline(userId),
    ])
      .exec()
      .then((result) => {
        if (result.length === 0) {
          return null;
        }
        return result[0];
      });
  }

  public async getAllOffers(
    userId: string | undefined,
    limit = DEFAULT_OFFER_AMOUNT,
    sortOrder: { [key: string]: SortOrder } = { publicationDate: SortOrder.Desc }
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        ...getPipeline(userId),
        { $limit: limit },
        { $sort: sortOrder },
      ])
      .exec();
  }

  public updateOffer(
    offerId: string,
    dto: UpdateOfferDto | UploadOfferImagesDto
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).exec();
  }

  public async deleteOfferById(
    offerId: string
  ): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  async getPremiumOffersByCity(
    userId: string | undefined,
    city: string,
    limit = OFFER_PREMIUM_COUNT
  ): Promise<DocumentType<OfferEntity>[]> {
    const premiumOffers = await this.offerModel.aggregate([
      {
        $match: {
          premium: true,
          city
        }
      },
      ...getPipeline(userId),
      { $limit: limit },
      { $sort: { publicationDate: SortOrder.Desc } }
    ]).exec();
    return premiumOffers;
  }

  public async getAllFavoriteOffersByUser(
    userId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    return this.userModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }
      },
      {
        $project: {
          _id: 0,
          favoriteOffers: {
            $map: {
              input: '$favorites',
              as: 'fav',
              in: {
                $toObjectId: '$$fav'
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'offers',
          localField: 'favoriteOffers',
          foreignField: '_id',
          as: 'favoriteOffers'
        }
      },
      {
        $unwind: {
          path: '$favoriteOffers'
        }
      },
      {
        $replaceRoot: { newRoot: '$favoriteOffers' }
      },
      ...commentsPipeline,
      ...authorPipeline,
      ...defaultPipeline,
    ]).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async isAuthor(
    authorId: string,
    documentId: string
  ): Promise<boolean> {
    const offer = await this.offerModel.findById(documentId);
    return offer?.authorId.toString() === authorId;
  }
}
