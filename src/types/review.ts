export interface Review {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  laundryQualityRating: number;
  pickupExperienceRating: number;
  deliveryExperienceRating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
}
