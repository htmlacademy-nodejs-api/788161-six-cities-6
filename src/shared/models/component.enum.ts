export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  OfferService: Symbol.for('OfferService'),
  OfferModel: Symbol.for('OfferModel'),
  CommentModel: Symbol.for('CommentModel'),
  CommentService: Symbol.for('CommentService'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
} as const;
