import { RATING, TEXT_LENGTH } from '../comment.constant.js';

export const CREATE_COMMENT_MESSAGES = {
  TEXT: {
    INVALID_FORMAT: 'Text is required',
    LENGTH_FIELD: `Min length is ${TEXT_LENGTH.MIN}, max is ${TEXT_LENGTH.MIN}`
  },
  RATING: {
    INVALID_FORMAT: 'Rating field must be an integer',
    MIN_VALUE: `Minimum rating is ${RATING.MIN}`,
    MAX_VALUE: `Maximum rating is ${RATING.MAX}`,
  },
  OFFER_ID: {
    INVALID_FORMAT: 'OfferId field must be a valid id'
  },
} as const;
