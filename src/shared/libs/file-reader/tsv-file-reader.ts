import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { RentalOffer } from '../../models/offer.interface.js';
import { ApartmentType } from '../../models/apartment.interface.js';
import { Facilities, facilitiesMapping } from '../../models/facilities.enum.js';
import { City } from '../../models/city.enum.js';
import { UserType } from '../../models/user.enum.js';


export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  private parseFacilities(facility: string): Facilities[] {
    return facility.split(',').map((facilityItem) => facilitiesMapping[facilityItem.trim()]);
  }

  public toArray(): RentalOffer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, publicationDate, cityValue, previewImage, housingPhotosList, isPremium, isFavorite, rating, apartmentType, roomAmount, guestAmount, rentalCost, facilitiesStr, firstname, email, avatarPath, password, userTypeValue, commentsAmount, latitude, longitude ]) => {
        const facilities: Facilities[] = this.parseFacilities(facilitiesStr);
        const housingPhotos: string[] = housingPhotosList.split(',').map((photo) => photo.trim());
        const premium: boolean = isPremium.toLowerCase() === 'true';
        const favorite: boolean = isFavorite.toLowerCase() === 'true';
        return {
          title,
          description,
          publicationDate: new Date(publicationDate),
          city: City[cityValue as keyof typeof City],
          previewImage,
          housingPhotos,
          premium,
          favorite,
          rating: Number.parseFloat(rating),
          apartmentType: ApartmentType[apartmentType as keyof typeof ApartmentType],
          roomAmount:  Number.parseInt(roomAmount, 10),
          guestAmount: Number.parseInt(guestAmount, 10),
          rentalCost: Number.parseInt(rentalCost, 10),
          facilities,
          author: {
            name: firstname,
            email,
            avatar: avatarPath,
            password,
            userType: UserType[userTypeValue as keyof typeof UserType]
          },
          commentsAmount: Number.parseInt(commentsAmount, 10),
          location: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          },
        };
      });
  }
}
