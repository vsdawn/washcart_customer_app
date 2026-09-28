import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Please give an overall star rating').max(5),
  laundryQualityRating: z.number().min(1).max(5),
  pickupExperienceRating: z.number().min(1).max(5),
  deliveryExperienceRating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
