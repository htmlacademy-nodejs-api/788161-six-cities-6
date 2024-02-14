import { inject, injectable } from 'inversify';
import { Component } from '../../models/index.js';
import { CommentEntity, CommentService, DEFAULT_COMMENT_AMOUNT } from './index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { SortOrder } from '../../models/sort-type.enum.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async createComment(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('authorId');
  }

  public async findCommentByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .sort({createdAt: SortOrder.Desc})
      .limit(DEFAULT_COMMENT_AMOUNT)
      .populate('authorId');
  }

  public async deleteCommentByOfferId(offerId: string): Promise<number | null> {
    const result = await this.commentModel.deleteMany({offerId}).exec();
    return result.deletedCount;
  }
}
