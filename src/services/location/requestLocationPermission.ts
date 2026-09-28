import { PermissionsAndroid, Platform } from 'react-native';

/** Android asks at runtime; iOS prompts on first use via Info.plist */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
    title: 'Allow location access',
    message: 'WashKart uses your location to check if we serve your area and to fill in your address.',
    buttonPositive: 'Allow',
    buttonNegative: 'Not now',
  });
  return result === PermissionsAndroid.RESULTS.GRANTED;
};
