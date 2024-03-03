import { ApartmentType } from '../../../models/apartment.interface.js';
import { City } from '../../../models/city.enum.js';
import { DESCRIPTION_LENGTH, GUESTS, RENTAL_COST, ROOMS, TITLE_LENGTH } from '../offer.constant.js';

export const UPDATE_OFFER_MESSAGES = {
  TITLE: {
    MIN_LENGTH: `Minimum title length must be ${TITLE_LENGTH.MIN}`,
    MAX_LENGTH: `Maximum title length must be ${TITLE_LENGTH.MAX}`,
  },
  DESCRIPTION: {
    MIN_LENGTH: `Minimum description length must be ${DESCRIPTION_LENGTH.MIN}`,
    MAX_LENGTH: `Maximum description length must be ${DESCRIPTION_LENGTH.MAX}`,
  },
  PUBLICATION_DATE: {
    INVALID_FORMAT: 'PublicationDate must be a valid ISO date',
  },
  RENTAL_COST: {
    INVALID_FORMAT: 'Rental cost must be an integer',
    MIN_VALUE: `Minimum price is ${RENTAL_COST.MIN}`,
    MAX_VALUE: `Maximum price is ${RENTAL_COST.MAX}`,
  },
  CITY: {
    INVALID_FORMAT: `City must be one of: ${Object.values(City)}`,
  },
  APARTMENT_TYPE: {
    INVALID_FORMAT: `Apartment type type must be one of: ${Object.values(ApartmentType)}`,
  },
  PREMIUM: {
    INVALID_FORMAT: 'Premium must be a boolean',
  },
  ROOM_AMOUNT: {
    INVALID_FORMAT: 'RoomAmount must be an integer',
    MIN_VALUE: `Minimum room amount is ${ROOMS.MIN}`,
    MAX_VALUE: `Maximum room amount is ${ROOMS.MAX}`,
  },
  GUEST_AMOUNT: {
    INVALID_FORMAT: 'Guests amount must be an integer',
    MIN_VALUE: `Minimum guest amount is ${GUESTS.MIN}`,
    MAX_VALUE: `Maximum guest amount is  ${GUESTS.MAX}`,
  },
  FACILITIES: {
    INVALID_FORMAT: 'Field facilities must be an array',
    INVALID: 'Facilities must be a valid facility',
  },
  COORDINATES: {
    INVALID_LATITUDE: 'Latitude must be a valid number',
    INVALID_LONGITUDE: 'Longitude must be a valid number',
  },
};
