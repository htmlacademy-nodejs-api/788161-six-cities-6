import { CreateCommentDto } from './dto/create-comment.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';

export interface CommentService {
  createComment(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findCommentByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteCommentByOfferId(offerId: string): Promise<number | null>;
}
