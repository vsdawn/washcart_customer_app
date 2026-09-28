/**
 * Price list shown on the Pricing tab.
 * Steam Ironing prices are confirmed; the other services are placeholders to be replaced with real rates.
 */
import type { IconName } from '../components/common/Icon';

export type GarmentGroupId = 'WEARABLE' | 'HOUSEHOLD';
export type GarmentWeight = 'Light' | 'Medium' | 'Heavy';

export interface PriceTier {
  weight: GarmentWeight;
  examples: string;
  standard: number;
  express: number;
}

export interface PricedService {
  id: string;
  name: string;
  tagline: string;
  icon: IconName;
  isPopular?: boolean;
  groups: Record<GarmentGroupId, PriceTier[]>;
}

export const GARMENT_GROUPS: { id: GarmentGroupId; label: string }[] = [
  { id: 'WEARABLE', label: 'Wearable' },
  { id: 'HOUSEHOLD', label: 'Household' },
];

export const PRICED_SERVICES: PricedService[] = [
  {
    id: 'steam-ironing',
    name: 'Steam Ironing',
    tagline: 'Crisp, wrinkle-free clothes',
    icon: 'iron-outline',
    isPopular: true,
    groups: {
      WEARABLE: [
        { weight: 'Light', examples: 'Shirts, T-shirts, Kurtas, Tops', standard: 10, express: 30 },
        { weight: 'Medium', examples: 'Trousers, Dresses, Cotton sarees', standard: 30, express: 90 },
        { weight: 'Heavy', examples: 'Silk sarees, Lehengas, Sherwanis', standard: 50, express: 150 },
      ],
      HOUSEHOLD: [
        { weight: 'Light', examples: 'Pillow covers, Napkins, Hand towels', standard: 15, express: 45 },
        { weight: 'Medium', examples: 'Bedsheets, Table cloths, Dupattas', standard: 35, express: 105 },
        { weight: 'Heavy', examples: 'Curtains, Quilt covers, Sofa covers', standard: 60, express: 180 },
      ],
    },
  },
  {
    id: 'dry-cleaning',
    name: 'Dry Cleaning',
    tagline: 'Deep clean, fresh finish',
    icon: 'dry-cleaning-outline',
    groups: {
      WEARABLE: [
        { weight: 'Light', examples: 'Shirts, Tops, Trousers', standard: 65, express: 195 },
        { weight: 'Medium', examples: 'Blazers, Dresses, Sarees', standard: 150, express: 450 },
        { weight: 'Heavy', examples: '3-piece suits, Lehengas, Overcoats', standard: 300, express: 900 },
      ],
      HOUSEHOLD: [
        { weight: 'Light', examples: 'Cushion covers, Table runners', standard: 99, express: 297 },
        { weight: 'Medium', examples: 'Bedsheets, Curtain panels', standard: 199, express: 597 },
        { weight: 'Heavy', examples: 'Blankets, Quilts, Rugs', standard: 399, express: 1197 },
      ],
    },
  },
  {
    id: 'wash-and-iron',
    name: 'Wash & Iron',
    tagline: 'Washed, dried and pressed',
    icon: 'washer-outline',
    groups: {
      WEARABLE: [
        { weight: 'Light', examples: 'Shirts, T-shirts, Innerwear', standard: 25, express: 75 },
        { weight: 'Medium', examples: 'Jeans, Trousers, Kurtas', standard: 45, express: 135 },
        { weight: 'Heavy', examples: 'Hoodies, Jackets, Sweaters', standard: 80, express: 240 },
      ],
      HOUSEHOLD: [
        { weight: 'Light', examples: 'Towels, Pillow covers', standard: 30, express: 90 },
        { weight: 'Medium', examples: 'Bedsheets, Table cloths', standard: 60, express: 180 },
        { weight: 'Heavy', examples: 'Curtains, Blankets', standard: 120, express: 360 },
      ],
    },
  },
  {
    id: 'bag-care',
    name: 'Bag Care',
    tagline: 'Clean & restore bags',
    icon: 'bag-outline',
    groups: {
      WEARABLE: [
        { weight: 'Light', examples: 'Wallets, Clutches, Small handbags', standard: 199, express: 597 },
        { weight: 'Medium', examples: 'Handbags, Backpacks', standard: 349, express: 1047 },
        { weight: 'Heavy', examples: 'Leather totes, Designer bags', standard: 599, express: 1797 },
      ],
      HOUSEHOLD: [
        { weight: 'Light', examples: 'Pouches, Laptop sleeves', standard: 249, express: 747 },
        { weight: 'Medium', examples: 'Duffel bags, Gym bags', standard: 449, express: 1347 },
        { weight: 'Heavy', examples: 'Suitcases, Trolley bags', standard: 799, express: 2397 },
      ],
    },
  },
  {
    id: 'shoe-care',
    name: 'Shoe Care',
    tagline: 'Polish, clean & restore',
    icon: 'shoe-outline',
    groups: {
      WEARABLE: [
        { weight: 'Light', examples: 'Canvas shoes, Sneakers', standard: 249, express: 747 },
        { weight: 'Medium', examples: 'Leather shoes, Loafers', standard: 399, express: 1197 },
        { weight: 'Heavy', examples: 'Boots, Suede & designer shoes', standard: 599, express: 1797 },
      ],
      HOUSEHOLD: [
        { weight: 'Light', examples: 'Slippers, Flip-flops', standard: 149, express: 447 },
        { weight: 'Medium', examples: 'Sandals, Floaters', standard: 249, express: 747 },
        { weight: 'Heavy', examples: 'Sports shoes, Kids school shoes', standard: 349, express: 1047 },
      ],
    },
  },
];

export const getStartingPrice = (service: PricedService): number =>
  Math.min(...Object.values(service.groups).flat().map(tier => tier.standard));

export const getPricedService = (id: string) => PRICED_SERVICES.find(s => s.id === id);
