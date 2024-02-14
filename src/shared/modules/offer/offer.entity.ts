import { Ref, Severity, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { ApartmentType, City, Coordinates, Facilities } from '../../models/index.js';
import { UserEntity } from '../user/index.js';


// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    collection: 'offers',
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title!: string;

  @prop({ trim: true })
  public description!: string;

  @prop({required: true})
  public publicationDate: Date;

  @prop({
    type: () => String,
    enum: City,
    required: true
  })
  public city: City;

  @prop()
  public previewImage: string;

  @prop({ required: true })
  public housingPhotos: string[];


  @prop({ required: true })
  public premium: boolean;

  @prop({
    enum: ApartmentType,
    type: () => String,
    required: true
  })
  public apartmentType: ApartmentType;

  @prop({ required: true })
  public roomAmount: number;

  @prop({ required: true })
  public guestAmount: number;

  @prop({ required: true })
  public rentalCost: number;


  @prop({
    enum: Facilities,
    type: () => String,
    required: true
  })
  public facilities: Facilities[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public authorId!: Ref<UserEntity>;


  @prop({ required: true })
  public location: Coordinates;

}

export const OfferModel = getModelForClass(OfferEntity);

