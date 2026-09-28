import ENV from '../../config/env';
import apiClient from './apiClient';
import { Review } from '../../types/review';

export interface SubmitReviewInput {
  orderId: string;
  rating: number;
  laundryQualityRating: number;
  pickupExperienceRating: number;
  deliveryExperienceRating: number;
  comment?: string;
}

export const reviewApi = {
  async submitReview(input: SubmitReviewInput): Promise<Review> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 700));
      return {
        id: `rev_${Date.now()}`,
        orderId: input.orderId,
        userId: 'usr_101',
        userName: 'Vishal Singh',
        rating: input.rating,
        laundryQualityRating: input.laundryQualityRating,
        pickupExperienceRating: input.pickupExperienceRating,
        deliveryExperienceRating: input.deliveryExperienceRating,
        comment: input.comment,
        createdAt: new Date().toISOString(),
      };
    }
    return apiClient.post<Review>('/reviews', input);
  },
};
