import { ApartmentType } from './apartment.interface.js';
import { City } from './city.enum.js';
import { Coordinates } from './coordinates.interface.js';
import { Facilities } from './facilities.enum.js';
import { User } from './user.interface.js';

export interface RentalOffer {
    title: string;
    description: string;
    publicationDate: Date;
    city: City;
    previewImage: string;
    housingPhotos: string[];
    premium: boolean;
    favorite: boolean;
    rating: number;
    apartmentType: ApartmentType;
    roomAmount: number;
    guestAmount: number;
    rentalCost: number;
    facilities: Facilities[];
    author: User;
    commentsAmount: number;
    location: Coordinates;
}
