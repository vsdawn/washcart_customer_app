export type AddressType = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  mobileNumber: string;
  houseFlat: string;
  building: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  addressType: AddressType;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  addressText?: string;
}
