import { addressSchema } from '../validation/addressSchemas';

describe('Address Form Validation Schema', () => {
  test('should validate complete Indian address data', () => {
    const validData = {
      fullName: 'Vishal Singh',
      mobileNumber: '9876543210',
      houseFlat: 'Flat 1202',
      building: 'Prestige Lakeside',
      street: 'Varthur Main Rd',
      area: 'Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560087',
      addressType: 'Home' as const,
      isDefault: true,
    };

    const result = addressSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test('should fail validation on invalid 5-digit pincode', () => {
    const invalidData = {
      fullName: 'Vishal Singh',
      mobileNumber: '9876543210',
      houseFlat: 'Flat 1202',
      building: 'Prestige',
      street: 'Main Rd',
      area: 'Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '5600', // invalid short pincode
      addressType: 'Home' as const,
    };

    const result = addressSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
