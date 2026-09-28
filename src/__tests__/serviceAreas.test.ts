import {
  SERVICE_AREAS,
  SERVICE_RADIUS_KM,
  checkServiceability,
  distanceKm,
  getAddressServiceability,
} from '../constants/serviceAreas';
import { MOCK_ADDRESSES } from '../mocks/addresses';

const whitefield = SERVICE_AREAS.find(a => a.id === 'whitefield')!;

/** A point `km` due north of the given point (1° latitude ≈ 111.19 km) */
const northOf = (p: { latitude: number; longitude: number }, km: number) => ({
  latitude: p.latitude + km / 111.195,
  longitude: p.longitude,
});

describe('Service area radius check', () => {
  test('distance matches known Bengaluru landmarks', () => {
    // MG Road metro to Indiranagar 100ft Road is roughly 3.7 km
    const km = distanceKm({ latitude: 12.9756, longitude: 77.6066 }, { latitude: 12.9784, longitude: 77.6408 });
    expect(km).toBeGreaterThan(3.5);
    expect(km).toBeLessThan(3.9);
  });

  test('an area centre is serviceable at 0 km', () => {
    const result = checkServiceability(whitefield);
    expect(result.isServiceable).toBe(true);
    expect(result.nearestArea.id).toBe('whitefield');
    expect(result.distanceKm).toBeCloseTo(0, 5);
  });

  test('3.9 km away is inside and 4.1 km away is outside the radius', () => {
    expect(SERVICE_RADIUS_KM).toBe(4);
    expect(checkServiceability(northOf(whitefield, 3.9)).isServiceable).toBe(true);
    expect(checkServiceability(northOf(whitefield, 4.1)).isServiceable).toBe(false);
  });

  test('far-away cities are not serviceable', () => {
    const electronicCity = { latitude: 12.8452, longitude: 77.6602 };
    const mumbai = { latitude: 19.076, longitude: 72.8777 };
    expect(checkServiceability(electronicCity).isServiceable).toBe(false);
    expect(checkServiceability(mumbai).isServiceable).toBe(false);
  });

  test('the demo saved addresses are inside the service area', () => {
    for (const address of MOCK_ADDRESSES) {
      expect(getAddressServiceability(address)?.isServiceable).toBe(true);
    }
  });

  test('addresses without coordinates cannot be verified', () => {
    expect(getAddressServiceability({})).toBeNull();
  });
});
