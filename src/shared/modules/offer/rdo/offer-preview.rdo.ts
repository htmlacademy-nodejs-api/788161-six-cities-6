import { Expose } from 'class-transformer';
import { City, ApartmentType, Coordinates } from '../../../models/index.js';


export class OfferPreviewRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public apartmentType: ApartmentType;

  @Expose()
  public publicationDate: string;

  @Expose()
  public city: City;

  @Expose()
  public location: Coordinates;

  @Expose()
  public previewImage: string;

  @Expose()
  public premium: boolean;

  @Expose()
  public favorites: boolean;

  @Expose()
  public averageRating: number;

  @Expose()
  public rentalCost: number;

  @Expose()
  public totalComments: number;
}
