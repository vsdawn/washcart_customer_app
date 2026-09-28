export const isValidIndianMobile = (mobile: string): boolean => {
  const cleaned = mobile.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
};

export const isValidOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const isValidPincode = (pincode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};

export const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Optional field in profile
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
