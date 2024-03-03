import { MinLength, MaxLength, IsEnum, IsArray, IsBoolean, IsInt, Min, Max, IsOptional, ValidateNested } from 'class-validator';
import { ApartmentType } from '../../../models/apartment.interface.js';
import { City } from '../../../models/city.enum.js';
import { Coordinates } from '../../../models/coordinates.interface.js';
import { Facilities } from '../../../models/facilities.enum.js';
import { UPDATE_OFFER_MESSAGES } from './update-offer.messages.js';
import { DESCRIPTION_LENGTH, TITLE_LENGTH } from '../offer.constant.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(TITLE_LENGTH.MIN, { message: UPDATE_OFFER_MESSAGES.TITLE.MIN_LENGTH})
  @MaxLength(TITLE_LENGTH.MAX, {message: UPDATE_OFFER_MESSAGES.TITLE.MAX_LENGTH})
  public title?: string;

  @IsOptional()
  @MinLength(DESCRIPTION_LENGTH.MIN, { message: UPDATE_OFFER_MESSAGES.DESCRIPTION.MIN_LENGTH })
  @MaxLength(DESCRIPTION_LENGTH.MAX, { message: UPDATE_OFFER_MESSAGES.DESCRIPTION.MAX_LENGTH })
  public description?: string;

  @IsOptional()
  @IsEnum(City, { message: UPDATE_OFFER_MESSAGES.CITY.INVALID_FORMAT })
  public city?: City;


  @IsOptional()
  @IsBoolean({ message: UPDATE_OFFER_MESSAGES.PREMIUM.INVALID_FORMAT })
  public premium?: boolean;

  @IsOptional()
  @IsEnum(ApartmentType, { message: UPDATE_OFFER_MESSAGES.APARTMENT_TYPE.INVALID_FORMAT })
  public apartmentType?: ApartmentType;

  @IsOptional()
  @IsInt({ message: UPDATE_OFFER_MESSAGES.ROOM_AMOUNT.INVALID_FORMAT })
  @Min(1, { message: UPDATE_OFFER_MESSAGES.ROOM_AMOUNT.MIN_VALUE })
  @Max(8, { message: UPDATE_OFFER_MESSAGES.ROOM_AMOUNT.MAX_VALUE })
  public roomAmount?: number;

  @IsOptional()
  @IsInt({ message: UPDATE_OFFER_MESSAGES.GUEST_AMOUNT.INVALID_FORMAT })
  @Min(1, { message: UPDATE_OFFER_MESSAGES.GUEST_AMOUNT.MIN_VALUE })
  @Max(10, { message: UPDATE_OFFER_MESSAGES.GUEST_AMOUNT.MAX_VALUE })
  public guestAmount?: number;

  @IsOptional()
  @IsInt({ message: UPDATE_OFFER_MESSAGES.RENTAL_COST.INVALID_FORMAT })
  @Min(100, { message: UPDATE_OFFER_MESSAGES.RENTAL_COST.MIN_VALUE })
  @Max(100000, { message: UPDATE_OFFER_MESSAGES.RENTAL_COST.MAX_VALUE })
  public rentalCost?: number;

  @IsOptional()
  @IsArray({ message: UPDATE_OFFER_MESSAGES.FACILITIES.INVALID_FORMAT })
  @IsEnum(Facilities, { each: true, message: UPDATE_OFFER_MESSAGES.FACILITIES.INVALID })
  public facilities?: Facilities[];

  @IsOptional()
  @ValidateNested()
  public location?: Coordinates;
}
