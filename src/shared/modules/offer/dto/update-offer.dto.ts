import { MinLength, MaxLength, IsEnum, IsArray, IsBoolean, IsInt, Min, Max, IsOptional, ValidateNested } from 'class-validator';
import { ApartmentType } from '../../../models/apartment.interface.js';
import { City } from '../../../models/city.enum.js';
import { Coordinates } from '../../../models/coordinates.interface.js';
import { Facilities } from '../../../models/facilities.enum.js';
import { UpdateOfferValidationMessage } from './update-offer.messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: UpdateOfferValidationMessage.title.minLength})
  @MaxLength(100, {message: UpdateOfferValidationMessage.title.maxLength})
  public title?: string;

  @IsOptional()
  @MinLength(20, { message: UpdateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: UpdateOfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsEnum(City, { message: UpdateOfferValidationMessage.city.invalid })
  public city?: City;


  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.premium.invalidFormat })
  public premium?: boolean;

  @IsOptional()
  @IsEnum(ApartmentType, { message: UpdateOfferValidationMessage.apartmentType.invalid })
  public apartmentType?: ApartmentType;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.roomAmount.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.roomAmount.minValue })
  @Max(8, { message: UpdateOfferValidationMessage.roomAmount.maxValue })
  public roomAmount?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.guestAmount.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.guestAmount.minValue })
  @Max(10, { message: UpdateOfferValidationMessage.guestAmount.maxValue })
  public guestAmount?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.rentalCost.invalidFormat })
  @Min(100, { message: UpdateOfferValidationMessage.rentalCost.minValue })
  @Max(100000, { message: UpdateOfferValidationMessage.rentalCost.maxValue })
  public rentalCost?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.facilities.invalidFormat })
  @IsEnum(Facilities, { each: true, message: UpdateOfferValidationMessage.facilities.invalid })
  public facilities?: Facilities[];

  @IsOptional()
  @ValidateNested()
  public location?: Coordinates;
}
