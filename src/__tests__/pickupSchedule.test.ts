import scheduleReducer, {
  addSchedule,
  cancelSchedule,
  selectUpcomingSchedules,
  updateSchedule,
} from '../store/slices/scheduleSlice';
import {
  addDays,
  getEstimatedDelivery,
  getScheduleDates,
  toLocalDateString,
} from '../constants/scheduleConfig';
import { PRICED_SERVICES, getStartingPrice } from '../constants/pricing';
import { PickupSchedule } from '../types/schedule';

const makeSchedule = (overrides: Partial<PickupSchedule> = {}): PickupSchedule => ({
  id: '100001',
  serviceName: 'Steam Ironing',
  address: 'Flat 1202, Whitefield, Bengaluru',
  items: [],
  itemRange: 'UPTO_10',
  pickupDate: addDays(toLocalDateString(new Date()), 1),
  timeSlot: 'MORNING',
  deliveryType: 'STANDARD',
  instructions: '',
  status: 'SCHEDULED',
  createdAt: '2026-09-27T10:00:00.000Z',
  updatedAt: '2026-09-27T10:00:00.000Z',
  ...overrides,
});

describe('Pickup date options', () => {
  test('start tomorrow, never today, and use local calendar dates', () => {
    // 23:30 local time is the case where toISOString() would report the wrong day in IST
    const lateEvening = new Date(2026, 8, 27, 23, 30);
    const dates = getScheduleDates(lateEvening, 3);

    expect(dates.map(d => d.dateString)).toEqual(['2026-09-28', '2026-09-29', '2026-09-30']);
    expect(dates[0].weekday).toBe('Tomorrow');
  });

  test('roll over month and year boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(getScheduleDates(new Date(2026, 1, 28), 1)[0].dateString).toBe('2026-03-01');
  });

  test('estimated standard delivery is the day after pickup in the same window', () => {
    const estimate = getEstimatedDelivery({ pickupDate: '2026-09-28', timeSlot: 'AFTERNOON' });
    expect(estimate).toContain('29');
    expect(estimate).toContain('12 PM - 3 PM');
  });
});

describe('Schedule store', () => {
  const empty = { schedules: [], hydrated: true };

  test('upcoming pickups exclude cancelled and past ones, soonest first', () => {
    const today = toLocalDateString(new Date());
    let state = scheduleReducer(empty, addSchedule(makeSchedule({ id: 'later', pickupDate: addDays(today, 3) })));
    state = scheduleReducer(state, addSchedule(makeSchedule({ id: 'evening', timeSlot: 'EVENING' })));
    state = scheduleReducer(state, addSchedule(makeSchedule({ id: 'morning', timeSlot: 'MORNING' })));
    state = scheduleReducer(state, addSchedule(makeSchedule({ id: 'past', pickupDate: addDays(today, -1) })));
    state = scheduleReducer(state, addSchedule(makeSchedule({ id: 'cancelled', status: 'CANCELLED' })));

    const upcoming = selectUpcomingSchedules({ schedule: state }).map(s => s.id);
    expect(upcoming).toEqual(['morning', 'evening', 'later']);
  });

  test('modifying a pickup updates its slot and bumps updatedAt', () => {
    let state = scheduleReducer(empty, addSchedule(makeSchedule()));
    state = scheduleReducer(state, updateSchedule({ id: '100001', timeSlot: 'EVENING', instructions: 'Call first' }));

    expect(state.schedules[0].timeSlot).toBe('EVENING');
    expect(state.schedules[0].instructions).toBe('Call first');
    expect(state.schedules[0].updatedAt).not.toBe(state.schedules[0].createdAt);
  });

  test('cancelling keeps the record with its reason', () => {
    let state = scheduleReducer(empty, addSchedule(makeSchedule()));
    state = scheduleReducer(state, cancelSchedule({ id: '100001', reason: 'Booked by mistake' }));

    expect(state.schedules[0].status).toBe('CANCELLED');
    expect(state.schedules[0].cancelReason).toBe('Booked by mistake');
    expect(selectUpcomingSchedules({ schedule: state })).toHaveLength(0);
  });
});

describe('Price list', () => {
  test('steam ironing matches the agreed rates', () => {
    const ironing = PRICED_SERVICES.find(s => s.id === 'steam-ironing')!;
    expect(getStartingPrice(ironing)).toBe(10);
    expect(ironing.groups.WEARABLE.map(t => [t.weight, t.standard, t.express])).toEqual([
      ['Light', 10, 30],
      ['Medium', 30, 90],
      ['Heavy', 50, 150],
    ]);
  });

  test('dry cleaning starts at 65 and every service has both groups with three tiers', () => {
    expect(getStartingPrice(PRICED_SERVICES.find(s => s.id === 'dry-cleaning')!)).toBe(65);
    for (const service of PRICED_SERVICES) {
      expect(service.groups.WEARABLE.map(t => t.weight)).toEqual(['Light', 'Medium', 'Heavy']);
      expect(service.groups.HOUSEHOLD.map(t => t.weight)).toEqual(['Light', 'Medium', 'Heavy']);
    }
  });
});
