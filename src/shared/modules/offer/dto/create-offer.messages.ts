export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  publicationDate: {
    invalidFormat: 'publicationDate must be a valid ISO date',
  },
  previewImage: {
    maxLength: 'Too short for field «image»',
  },
  housingPhotos: {
    invalidFormat: 'images must be an array',
    maxLength: 'Too short for field «images»',
    invalidSize: 'Should always be 6 images',
  },
  rentalCost: {
    invalidFormat: 'Rental cost must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  city: {
    invalid: 'City must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  apartmentType: {
    invalid: 'Apartment type type must be a valid property type',
  },
  premium: {
    invalidFormat: 'premium must be a boolean',
  },
  roomAmount: {
    invalidFormat: 'roomsNumber must be an integer',
    minValue: 'Minimum price is 1',
    maxValue: 'Maximum price is 8',
  },
  guestAmount: {
    invalidFormat: 'guestsNumber must be an integer',
    minValue: 'Minimum price is 1',
    maxValue: 'Maximum price is 10',
  },
  facilities: {
    invalidFormat: 'Field facilities must be an array',
    invalid: 'Facilities must be a valid facility',
  },
  authorId: {
    invalidId: 'authorId field must be a valid id',
  },
  coordinates: {
    invalidLatitude: 'Latitude must be a valid number',
    invalidLongitude: 'Longitude must be a valid number',
  },
} as const;

