import { City } from '../models/city.enum.js';
import { ApartmentType, Coordinates, Facilities, facilitiesMapping } from '../models/index.js';
import { RentalOffer } from '../models/offer.interface.js';
import { UserType } from '../models/user.enum.js';

export function parseFacilities(facility: string): Facilities[] {
  return facility.split(',').map((facilityItem) => facilitiesMapping[facilityItem.trim()]);
}

export function parseLocation(location: string): Coordinates {
  const [latitude, longitude] = location.split(';').map((coordinate) => Number.parseFloat(coordinate));

  return { latitude, longitude };
}

export function createOffer(offerData: string): RentalOffer {
  const [
    title,
    description,
    previewImage,
    housingPhotosList,
    name,
    email,
    userType,
    avatar,
    publicationDate,
    cityValue,
    isPremium,
    isFavorite,
    rating,
    apartmentType,
    roomAmount,
    guestAmount,
    rentalCost,
    facilitiesArray,
    commentsAmount,
    location
  ] = offerData.replace('\n', '').split('\t');
  const housingPhotos: string[] = housingPhotosList.split(',').map((photo) => photo.trim());
  const facilities: Facilities[] = parseFacilities(facilitiesArray);

  return {
    title,
    description,
    previewImage,
    housingPhotos,
    author: {
      email,
      name,
      avatar,
      userType: UserType[userType as keyof typeof UserType]
    },

    publicationDate: new Date(publicationDate),
    city: City[cityValue as keyof typeof City],
    premium :  Boolean(isPremium),
    favorite: Boolean(isFavorite),
    rating: Number.parseFloat(rating),
    apartmentType: ApartmentType[apartmentType as keyof typeof ApartmentType],
    roomAmount:  Number.parseInt(roomAmount, 10),
    guestAmount: Number.parseInt(guestAmount, 10),
    rentalCost: Number.parseInt(rentalCost, 10),
    facilities,
    commentsAmount: Number.parseInt(commentsAmount, 10),
    location: parseLocation(location)
  };
}
