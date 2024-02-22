import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity } from './index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { SortOrder } from '../../models/sort-type.enum.js';


export interface OfferService {
  createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getAllOffers(limit?: number, sortOrder?: { [key: string]: SortOrder }): Promise<DocumentType<OfferEntity>[]>
  updateOffer(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getPremiumOffersByCity(city: string, limit?: number): Promise<DocumentType<OfferEntity>[]>;
  getAllFavoriteOffersByUser(userId: string): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
