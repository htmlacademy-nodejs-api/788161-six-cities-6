export enum Facilities {
    Breakfast = 'Breakfast',
    AirConditioning = 'Air conditioning',
    LaptopFriendlyWorkspace = 'Laptop friendly workspace',
    BabySeat = 'Baby seat',
    Washer = 'Washer',
    Towels = 'Towels',
    Fridge = 'Fridge',
}


export const facilitiesMapping: Record<string, Facilities> = {
  'Breakfast': Facilities.Breakfast,
  'Air conditioning': Facilities.AirConditioning,
  'Laptop friendly workspace': Facilities.LaptopFriendlyWorkspace,
  'Baby seat': Facilities.BabySeat,
  'Washer': Facilities.Washer,
  'Towels': Facilities.Towels,
  'Fridge': Facilities.Fridge,
};
