/**
 * Areas WashKart currently serves. An address is serviceable when it lies within
 * SERVICE_RADIUS_KM of any area's centre. Add or move areas here to change coverage.
 */
import { LocationCoordinates } from '../types/address';

export const SERVICE_RADIUS_KM = 4;

export interface ServiceArea {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export const SERVICE_AREAS: ServiceArea[] = [
  { id: 'whitefield', name: 'Whitefield', latitude: 12.9698, longitude: 77.75 },
  { id: 'indiranagar', name: 'Indiranagar', latitude: 12.9784, longitude: 77.6408 },
  { id: 'koramangala', name: 'Koramangala', latitude: 12.9352, longitude: 77.6245 },
  { id: 'singasandra', name: 'Singasandra', latitude: 12.881, longitude: 77.649 },
];

export const SERVICE_AREA_NAMES = SERVICE_AREAS.map(a => a.name).join(', ');

const EARTH_RADIUS_KM = 6371;
const toRadians = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle (haversine) distance between two points, in km */
export const distanceKm = (a: LocationCoordinates, b: LocationCoordinates): number => {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

export interface ServiceabilityResult {
  isServiceable: boolean;
  nearestArea: ServiceArea;
  distanceKm: number;
}

export const checkServiceability = (point: LocationCoordinates): ServiceabilityResult => {
  const [nearest] = SERVICE_AREAS.map(area => ({ area, km: distanceKm(point, area) })).sort(
    (x, y) => x.km - y.km
  );
  return {
    isServiceable: nearest.km <= SERVICE_RADIUS_KM,
    nearestArea: nearest.area,
    distanceKm: nearest.km,
  };
};

/** Addresses saved before coordinates were captured cannot be verified */
export const getAddressServiceability = (address: {
  latitude?: number;
  longitude?: number;
}): ServiceabilityResult | null =>
  address.latitude != null && address.longitude != null
    ? checkServiceability({ latitude: address.latitude, longitude: address.longitude })
    : null;
