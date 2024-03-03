import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import { ApartmentType, City, Coordinates, Facilities } from '../../../models/index.js';
import { CREATE_OFFER_MESSAGES } from './create-offer.messages.js';
import { DESCRIPTION_LENGTH, GUESTS, RENTAL_COST, ROOMS, TITLE_LENGTH } from '../offer.constant.js';

export class CreateOfferDto {
  @MinLength(TITLE_LENGTH.MIN, { message: CREATE_OFFER_MESSAGES.TITLE.MIN_LENGTH})
  @MaxLength(TITLE_LENGTH.MAX, {message: CREATE_OFFER_MESSAGES.TITLE.MAX_LENGTH})
  public title: string;

  @MinLength(DESCRIPTION_LENGTH.MIN, { message: CREATE_OFFER_MESSAGES.DESCRIPTION.MIN_LENGTH })
  @MaxLength(DESCRIPTION_LENGTH.MAX, { message: CREATE_OFFER_MESSAGES.DESCRIPTION.MAX_LENGTH })
  public description: string;

  @IsDateString({}, { message: CREATE_OFFER_MESSAGES.PUBLICATION_DATE.INVALID_FORMAT })
  public publicationDate: Date;

  @IsEnum(City, { message: CREATE_OFFER_MESSAGES.CITY.INVALID_FORMAT })
  public city: City;

  @IsArray({ message: CREATE_OFFER_MESSAGES.HOUSING_PHOTOS.INVALID_FORMAT })
  public housingPhotos: string[];

  @IsBoolean({ message: CREATE_OFFER_MESSAGES.PREMIUM.INVALID_FORMAT })
  public premium: boolean;

  @IsEnum(ApartmentType, { message: CREATE_OFFER_MESSAGES.APARTMENT_TYPE.INVALID_FORMAT })
  public apartmentType: ApartmentType;

  @IsInt({ message: CREATE_OFFER_MESSAGES.ROOM_AMOUNT.INVALID_FORMAT })
  @Min(ROOMS.MIN, { message: CREATE_OFFER_MESSAGES.ROOM_AMOUNT.MIN_VALUE })
  @Max(ROOMS.MAX, { message: CREATE_OFFER_MESSAGES.ROOM_AMOUNT.MAX_VALUE })
  public roomAmount: number;

  @IsInt({ message: CREATE_OFFER_MESSAGES.GUEST_AMOUNT.INVALID_FORMAT })
  @Min(GUESTS.MIN, { message: CREATE_OFFER_MESSAGES.GUEST_AMOUNT.MIN_VALUE })
  @Max(GUESTS.MAX, { message: CREATE_OFFER_MESSAGES.GUEST_AMOUNT.MAX_VALUE })
  public guestAmount: number;

  @IsInt({ message: CREATE_OFFER_MESSAGES.RENTAL_COST.INVALID_FORMAT })
  @Min(RENTAL_COST.MIN, { message: CREATE_OFFER_MESSAGES.RENTAL_COST.MIN_VALUE })
  @Max(RENTAL_COST.MAX, { message: CREATE_OFFER_MESSAGES.RENTAL_COST.MAX_VALUE })
  public rentalCost: number;

  @IsArray({ message: CREATE_OFFER_MESSAGES.FACILITIES.INVALID_FORMAT })
  @IsEnum(Facilities, { each: true, message: CREATE_OFFER_MESSAGES.FACILITIES.INVALID })
  public facilities: Facilities[];

  public authorId: string;

  @ValidateNested()
  public location: Coordinates;
}
