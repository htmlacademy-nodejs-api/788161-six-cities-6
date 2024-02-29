import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { MockServerData } from '../../models/mock-server-data.type.js';
import { OfferGenerator } from './offer-generator.interface.js';
import { GUESTS, LATITUDE_RANGE, LONGITUDE_RANGE, PRICE, ROOMS, WEEK_DAY } from './offer-conditions.js';
import { Facilities } from '../../models/facilities.enum.js';
import { ApartmentType, UserType } from '../../models/index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData){}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const roomImages = getRandomItems<string>(this.mockData.roomImages).join(';');
    const user = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const userType = getRandomItem(Object.values(UserType));
    const avatar = getRandomItem(this.mockData.avatars);

    const createPostData = dayjs()
      .subtract(generateRandomValue(WEEK_DAY.FIRST, WEEK_DAY.LAST), 'day')
      .toISOString();

    const city = getRandomItem(this.mockData.cities);
    const isPremium = getRandomItem<boolean>([true, false]);
    const apartmentType = getRandomItem(Object.values(ApartmentType));
    const roomAmount = generateRandomValue(ROOMS.MIN, ROOMS.MAX);
    const guestAmount = generateRandomValue(GUESTS.MIN, GUESTS.MAX);
    const price = generateRandomValue(PRICE.MIN, PRICE.MAX);
    const facilities = getRandomItems(Object.values(Facilities));
    const location = [
      generateRandomValue(LATITUDE_RANGE.MIN, LATITUDE_RANGE.MAX, 6),
      generateRandomValue(LONGITUDE_RANGE.MIN, LONGITUDE_RANGE.MAX, 6),
    ].join(';');

    return [
      title,
      description,
      roomImages,
      user,
      email,
      userType,
      avatar,
      createPostData,
      city.name,
      isPremium,
      apartmentType,
      roomAmount,
      guestAmount,
      price,
      facilities,
      location,
    ].join('\t');
  }
}
