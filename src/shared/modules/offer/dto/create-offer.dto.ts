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
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength})
  @MaxLength(100, {message: CreateOfferValidationMessage.title.maxLength})
  public title: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({}, { message: CreateOfferValidationMessage.publicationDate.invalidFormat })
  public publicationDate: Date;

  @IsEnum(City, { message: CreateOfferValidationMessage.city.invalid })
  public city: City;

  @IsArray({ message: CreateOfferValidationMessage.housingPhotos.invalidFormat })
  @MaxLength(256, { each: true, message: CreateOfferValidationMessage.housingPhotos.maxLength })
  public housingPhotos: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.premium.invalidFormat })
  public premium: boolean;

  @IsEnum(ApartmentType, { message: CreateOfferValidationMessage.apartmentType.invalid })
  public apartmentType: ApartmentType;

  @IsInt({ message: CreateOfferValidationMessage.roomAmount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomAmount.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomAmount.maxValue })
  public roomAmount: number;

  @IsInt({ message: CreateOfferValidationMessage.guestAmount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guestAmount.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guestAmount.maxValue })
  public guestAmount: number;

  @IsInt({ message: CreateOfferValidationMessage.rentalCost.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.rentalCost.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.rentalCost.maxValue })
  public rentalCost: number;

  @IsArray({ message: CreateOfferValidationMessage.facilities.invalidFormat })
  @IsEnum(Facilities, { each: true, message: CreateOfferValidationMessage.facilities.invalid })
  public facilities: Facilities[];

  public authorId: string;

  @ValidateNested()
  public location: Coordinates;
}
