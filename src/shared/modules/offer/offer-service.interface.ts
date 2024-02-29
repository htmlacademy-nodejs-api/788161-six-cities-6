import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity } from './index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { SortOrder } from '../../models/sort-type.enum.js';
import { DocumentExists } from '../../models/index.js';
import { UploadOfferImagesDto } from './dto/upload-offer-images.dto.js';

export interface OfferService extends DocumentExists {
  createOffer(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findOfferById(userId: string | undefined, offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getAllOffers(userId: string | undefined, limit?: number, sortOrder?: { [key: string]: SortOrder }): Promise<DocumentType<OfferEntity>[]>
  updateOffer(offerId: string, dto: UpdateOfferDto | UploadOfferImagesDto): Promise<DocumentType<OfferEntity> | null>;
  deleteOfferById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getPremiumOffersByCity(userId: string | undefined, city: string, limit?: number): Promise<DocumentType<OfferEntity>[]>;
  getAllFavoriteOffersByUser(userId: string): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  isAuthor(userId: string, documentId: string): Promise<boolean>;
}
