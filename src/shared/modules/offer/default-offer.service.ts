import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../models/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, mongoose, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto, UpdateOfferDto } from './index.js';
import { DEFAULT_OFFER_AMOUNT, DEFAULT_OFFER_PREMIUM_COUNT } from './offer.constant.js';
import { SortOrder } from '../../models/sort-type.enum.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<OfferEntity>,
  ){}


  private userLookupPipeline = [
    {
      $lookup: {
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'author'
      }
    }
  ];

  private commentLookupPipeline = [
    {
      $lookup: {
        from: 'comments',
        localField: 'authorId',
        foreignField: 'authorId',
        as: 'comments'
      }
    }, {
      $addFields: {
        totalComments: {
          $size: '$comments'
        },
        averageRating: {
          $avg: '$comments.rating'
        }
      }
    }, {
      $unset: 'comments'
    }
  ];

  // создание нового
  public async createOffer(dto: CreateOfferDto): Promise<types.DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}.`);

    return result;
  }

  // получение инфы об одном
  // TO DO добавить избранное
  public async findOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $toObjectId: '$_id' }, { $toObjectId: offerId }]
          }
        }
      },
      ...this.userLookupPipeline,
      ...this.commentLookupPipeline,
    ])
      .exec()
      .then((result) => {
        if (result.length === 0) {
          return null;
        }
        return result[0];
      });
  }

  // список всех офферов
  // TO DO добавить избранное
  public async getAllOffers(limit = DEFAULT_OFFER_AMOUNT, sortOrder: { [key: string]: SortOrder } = { publicationDate: SortOrder.Desc }): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        ...this.userLookupPipeline,
        ...this.commentLookupPipeline,
        { $limit: limit },
        { $sort: sortOrder },
      ]);
  }

  public updateOffer(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).exec();
  }

  public async deleteOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  async getPremiumOffersByCity(city: string, limit = DEFAULT_OFFER_PREMIUM_COUNT): Promise<DocumentType<OfferEntity>[]> {
    const premiumOffers = await this.offerModel.aggregate([
      {
        $match: {
          premium: true,
          city
        }
      },
      ...this.commentLookupPipeline,
      { $limit: limit },
      { $sort: { publicationDate: SortOrder.Desc } }
    ]).exec();
    return premiumOffers;
  }

  public async getAllFavoriteOffersByUser(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const favoriteOffers = await this.userModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }
      },
      {
        $project: {
          _id: 1,
          favorites: {
            $map: {
              input: '$favorites',
              as: 'fav',
              in: {
                $toObjectId: '$$fav'
              }
            }
          }
        }
      }, {
        $lookup: {
          from: 'offers',
          localField: 'favorites',
          foreignField: '_id',
          as: 'favoriteOffers'
        }
      }, {
        $unwind: {
          path: '$favoriteOffers'
        }
      }, {
        $unset: [
          'favorites', '_id'
        ]
      }
    ]).exec();
    return favoriteOffers;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }
}
