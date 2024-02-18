import { Expose, Type } from 'class-transformer';
import { ApartmentType, Coordinates, Facilities } from '../../../models/index.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class OfferRdo {

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public publicationDate: string;

  @Expose()
  public city: string;

  @Expose()
  public previewImage: string;

  @Expose()
  public housingPhotos: string[];

  @Expose()
  public premium: boolean;

  @Expose()
  public favorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public apartmentType: ApartmentType;

  @Expose()
  public roomAmount: number;

  @Expose()
  public guestAmount: number;

  @Expose()
  public rentalCost: number;

  @Expose()
  public facilities: Facilities[];

  @Expose()
  public location: Coordinates;

  @Expose()
  public commentAmount: number;

  @Expose()
  @Type(() => UserRdo)
  public user: UserRdo;
}
