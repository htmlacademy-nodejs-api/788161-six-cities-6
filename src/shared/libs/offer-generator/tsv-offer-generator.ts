import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { MockServerData } from '../../models/mock-server-data.type.js';
import { OfferGenerator } from './offer-generator.interface.js';
import { COMMENTS, GUESTS, LATITUDE_RANGE, LONGITUDE_RANGE, PRICE, RATING, ROOMS, WEEK_DAY } from './offer-conditions.js';
import { Facilities } from '../../models/facilities.enum.js';
import { UserType } from '../../models/index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData){}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const roomImages = getRandomItems<string>(this.mockData.roomImages).join(';');
    const user = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const userType = getRandomItem(Object.values(UserType));
    const avatar = getRandomItem(this.mockData.avatars);

    const createPostData = dayjs()
      .subtract(generateRandomValue(WEEK_DAY.FIRST, WEEK_DAY.LAST), 'day')
      .toISOString();

    const city = getRandomItem<string>(this.mockData.cities);
    const isPremium = getRandomItem<boolean>([true, false]);
    const isFavorite = getRandomItem<boolean>([true, false]);
    const rating = generateRandomValue(RATING.MIN, RATING.MAX, 1);
    const apartmentType = getRandomItem<string>(this.mockData.apartmentTypes);
    const roomAmount = generateRandomValue(ROOMS.MIN, ROOMS.MAX);
    const guestAmount = generateRandomValue(GUESTS.MIN, GUESTS.MAX);
    const price = generateRandomValue(PRICE.MIN, PRICE.MAX);
    const facilities = getRandomItems(Object.values(Facilities));
    const commentAmount = generateRandomValue(COMMENTS.MIN, COMMENTS.MAX);
    const location = [
      generateRandomValue(LATITUDE_RANGE.MIN, LATITUDE_RANGE.MAX, 6),
      generateRandomValue(LONGITUDE_RANGE.MIN, LONGITUDE_RANGE.MAX, 6),
    ].join(';');

    return [
      title,
      description,
      previewImage,
      roomImages,
      user,
      email,
      userType,
      avatar,
      createPostData,
      city,
      isPremium,
      isFavorite,
      rating,
      apartmentType,
      roomAmount,
      guestAmount,
      price,
      facilities,
      commentAmount,
      location,
    ].join('\t');
  }
}
