import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';
import { CREATE_COMMENT_MESSAGES } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CREATE_COMMENT_MESSAGES.TEXT.INVALID_FORMAT })
  @Length(5, 1024, { message: CREATE_COMMENT_MESSAGES.TEXT.LENGTH_FIELD})
  public text: string;

  @IsInt({ message: CREATE_COMMENT_MESSAGES.RATING.INVALID_FORMAT })
  @Min(1, { message: CREATE_COMMENT_MESSAGES.RATING.MIN_VALUE })
  @Max(5, { message: CREATE_COMMENT_MESSAGES.RATING.MAX_VALUE })
  public rating: number;

  @IsMongoId({ message: CREATE_COMMENT_MESSAGES.OFFER_ID.INVALID_FORMAT })
  public offerId: string;

  public authorId: string;
}
