import { ApartmentType } from '../models/apartment.interface.js';
import { City } from '../models/city.enum.js';
import { Facilities, facilitiesMapping } from '../models/facilities.enum.js';
import { RentalOffer } from '../models/offer.interface.js';
import { UserType } from '../models/user.enum.js';

export function parseFacilities(facility: string): Facilities[] {
  return facility.split(',').map((facilityItem) => facilitiesMapping[facilityItem.trim()]);
}

export function createOffer(offerData: string): RentalOffer {
  const [
    title,
    description,
    publicationDate,
    cityValue,
    previewImage,
    housingPhotosList,
    isPremium,
    isFavorite,
    rating,
    apartmentType,
    roomAmount,
    guestAmount,
    rentalCost,
    facilitiesStr,
    name,
    email,
    avatar,
    password,
    userType,
    commentsAmount,
    latitude,
    longitude
  ] = offerData.replace('\n', '').split('\t');
  const housingPhotos: string[] = housingPhotosList.split(',').map((photo) => photo.trim());
  const facilities: Facilities[] = parseFacilities(facilitiesStr);

  return {
    title,
    description,
    publicationDate: new Date(publicationDate),
    city: City[cityValue as keyof typeof City],
    previewImage,
    housingPhotos,
    premium :  Boolean(isPremium),
    favorite: Boolean(isFavorite),
    rating: Number.parseFloat(rating),
    apartmentType: ApartmentType[apartmentType as keyof typeof ApartmentType],
    roomAmount:  Number.parseInt(roomAmount, 10),
    guestAmount: Number.parseInt(guestAmount, 10),
    rentalCost: Number.parseInt(rentalCost, 10),
    facilities,
    author: {
      email,
      name,
      avatar,
      password,
      userType: UserType[userType as keyof typeof UserType]
    },
    commentsAmount: Number.parseInt(commentsAmount, 10),
    location: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    }
  };
}
