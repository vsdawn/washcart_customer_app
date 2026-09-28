import { z } from 'zod';

export const complaintSchema = z.object({
  orderId: z.string().min(1, 'Please select an order'),
  issueType: z.enum([
    'Missing item',
    'Damaged item',
    'Stain',
    'Wrong item',
    'Late delivery',
    'Payment issue',
    'Other',
  ]),
  description: z.string().min(10, 'Please describe your complaint in detail (min 10 characters)'),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
