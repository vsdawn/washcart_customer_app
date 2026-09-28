import { z } from 'zod';
import { isValidIndianMobile, isValidPincode } from '../utils/validators';

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  mobileNumber: z.string().refine((val: string) => isValidIndianMobile(val), {
    message: 'Valid 10-digit mobile number required',
  }),
  houseFlat: z.string().min(1, 'House/Flat number is required'),
  building: z.string().min(1, 'Building/Apartment name is required'),
  street: z.string().min(2, 'Street/Locality is required'),
  area: z.string().min(2, 'Area is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().refine((val: string) => isValidPincode(val), {
    message: 'Valid 6-digit Indian pincode required',
  }),
  landmark: z.string().optional(),
  addressType: z.enum(['Home', 'Work', 'Other']),
  isDefault: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;
export type AddressFormInput = z.input<typeof addressSchema>;
