export const CreateCommentMessages = {
  text: {
    invalidFormat: 'Text is required',
    lengthField: 'Min length is 5, max is 2024'
  },
  rating: {
    invalidFormat: 'Rating field must be an integer',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5',
  },
  offerId: {
    invalidFormat: 'OfferId field must be a valid id'
  },
  authorId: {
    invalidFormat: 'AuthorId field must be a valid id'
  },
} as const;
