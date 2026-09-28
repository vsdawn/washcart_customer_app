import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from './requestLocationPermission';
import { LocationCoordinates } from '../../types/address';

/**
 * Geocoding uses OpenStreetMap Nominatim (free, no API key, fair-use limit of ~1 request/second).
 * Before a large launch, switch these two calls to a paid provider such as Google Geocoding.
 */
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const REQUEST_TIMEOUT_MS = 10000;

export class LocationError extends Error {
  constructor(
    public readonly code: 'PERMISSION_DENIED' | 'UNAVAILABLE' | 'TIMEOUT',
    message: string
  ) {
    super(message);
  }
}

export interface AddressParts {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

interface NominatimAddress {
  road?: string;
  neighbourhood?: string;
  quarter?: string;
  suburb?: string;
  city_district?: string;
  city?: string;
  town?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
}

const fetchJson = async <T>(url: string): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      // Nominatim asks apps to identify themselves; browsers ignore this header
      headers: { 'Accept-Language': 'en', 'User-Agent': 'WashKart-CustomerApp/1.0' },
    });
    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
};

export class LocationService {
  public static async getCurrentLocation(): Promise<LocationCoordinates> {
    if (!(await requestLocationPermission())) {
      throw new LocationError('PERMISSION_DENIED', 'Location permission was denied.');
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position =>
          resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        error => {
          if (error.code === error.PERMISSION_DENIED) {
            reject(new LocationError('PERMISSION_DENIED', 'Location permission was denied.'));
          } else if (error.code === error.TIMEOUT) {
            reject(new LocationError('TIMEOUT', 'Finding your location took too long.'));
          } else {
            reject(new LocationError('UNAVAILABLE', 'Your location is unavailable. Is GPS turned on?'));
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }

  /** Coordinates → address fields, used to pre-fill the form from GPS */
  public static async reverseGeocode(coords: LocationCoordinates): Promise<AddressParts> {
    const result = await fetchJson<{ address?: NominatimAddress }>(
      `${NOMINATIM_URL}/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${coords.latitude}&lon=${coords.longitude}`
    );
    const a = result.address ?? {};
    return {
      street: a.road ?? '',
      area: a.suburb ?? a.quarter ?? a.neighbourhood ?? a.city_district ?? '',
      city: a.city ?? a.town ?? a.state_district ?? a.county ?? '',
      state: a.state ?? '',
      pincode: a.postcode?.replace(/\s/g, '') ?? '',
    };
  }

  /**
   * Address fields → coordinates. Tries the most specific query first and falls back to
   * area + pincode, then pincode alone. Returns null when nothing matches.
   */
  public static async geocodeAddress(parts: AddressParts): Promise<LocationCoordinates | null> {
    const queries = [
      [parts.street, parts.area, parts.city, parts.pincode],
      [parts.area, parts.city, parts.pincode],
      [parts.pincode, 'India'],
    ].map(fields => fields.filter(Boolean).join(', '));

    for (const q of queries) {
      const results = await fetchJson<{ lat: string; lon: string }[]>(
        `${NOMINATIM_URL}/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`
      );
      if (results.length > 0) {
        return { latitude: Number(results[0].lat), longitude: Number(results[0].lon) };
      }
    }
    return null;
  }
}

export default LocationService;
