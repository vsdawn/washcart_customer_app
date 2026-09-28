export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  imageUrl: string;
  description: string;
  popular: boolean;
}

export type UnitType = 'kg' | 'piece' | 'pair' | 'set';

export interface LaundryService {
  id: string;
  categoryId: string;
  categorySlug: string;
  name: string;
  description: string;
  price: number;
  unit: UnitType;
  estimatedHours: number;
  includes: string[];
  excludes: string[];
  imageUrl: string;
  isPopular?: boolean;
  isActive: boolean;
  minQuantity?: number;
}
