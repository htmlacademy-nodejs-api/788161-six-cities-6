export const getUserPipeline = (userId: string) => [
  {
    $lookup: {
      from: 'users',
      let: { userId: { $toObjectId: userId } },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
        { $project: { _id: 0, favorites: 1 } },
      ],
      as: 'users',
    },
  },
  {
    $addFields: {
      user: { $arrayElemAt: ['$users', 0] },
    },
  },
  {
    $unset: ['users'],
  },
];


export const defaultPipeline = [
  {
    $project: {
      _id: 0,
      id: { $toString: '$_id' },
      author: 1,
      city: 1,
      averageRating: { $ifNull: [{ $avg: '$comments.rating' }, 0] },
      favorites: { $in: ['$_id', { $ifNull: ['$user.favorites', []] }] },
      totalComments: { $size: '$comments' },
      previewImage: 1,
      publicationDate: 1,
      premium: 1,
      rentalCost: 1,
      title: 1,
      description: 1,
      location: 1,
      housingPhotos: 1,
      facilities: 1,
      apartmentType: 1,
      roomAmount: 1,
      guestAmount: 1,
    },
  },
];


export const commentsPipeline = [
  {
    $lookup: {
      from: 'comments',
      let: { offerId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$$offerId', '$offerId'] } } },
        { $project: { _id: 0, rating: 1 } },
      ],
      as: 'comments',
    },
  },
];

export const authorPipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'users',
    },
  },
  {
    $addFields: {
      author: { $arrayElemAt: ['$users', 0] },
    },
  },
  {
    $unset: ['users'],
  },
];

export const getPipeline = (userId?: string) => {
  const userPipeline = userId ? getUserPipeline(userId) : [];

  return [
    ...commentsPipeline,
    ...authorPipeline,
    ...userPipeline,
    ...defaultPipeline,
  ];
};
