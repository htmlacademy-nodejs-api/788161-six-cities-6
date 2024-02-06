import { ApartmentType, City, Coordinates, Facilities } from '../../../models/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public publicationDate: Date;
  public city: City;
  public previewImage: string;
  public housingPhotos: string[];
  public premium: boolean;
  public favorite: boolean;
  public rating: number;
  public apartmentType: ApartmentType;
  public roomAmount: number;
  public guestAmount: number;
  public rentalCost: number;
  public facilities: Facilities[];
  public authorId: string;
  public commentsAmount: number;
  public location: Coordinates;
}
