import { IsBoolean } from 'class-validator';
import { FavoriteOfferMessages } from './favorite-offer.messages.js';

export class FavoriteOfferDto {
  @IsBoolean({ message: FavoriteOfferMessages.favorites.invalidFormat })
  public favorites: boolean;
}
