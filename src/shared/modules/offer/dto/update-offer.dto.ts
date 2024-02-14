import { ApartmentType } from '../../../models/apartment.interface.js';
import { City } from '../../../models/city.enum.js';
import { Coordinates } from '../../../models/coordinates.interface.js';
import { Facilities } from '../../../models/facilities.enum.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public housingPhotos?: string[];
  public premium?: boolean;
  public apartmentType?: ApartmentType;
  public roomAmount?: number;
  public guestAmount?: number;
  public rentalCost?: number;
  public facilities?: Facilities[];
  public location?: Coordinates;
}
