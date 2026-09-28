import { DeliveryTypeId, ItemRangeId, PickupSchedule, TimeSlotId } from '../types/schedule';

export const ITEM_RANGES: { id: ItemRangeId; label: string; caption: string }[] = [
  { id: 'UPTO_10', label: 'Less than 10', caption: 'A few everyday clothes' },
  { id: 'FROM_11_TO_20', label: '11 - 20', caption: 'About a week of laundry' },
  { id: 'FROM_21_TO_50', label: '21 - 50', caption: 'Family or bulk load' },
  { id: 'ABOVE_50', label: 'More than 50', caption: 'Large or household load' },
];

export const SCHEDULE_TIME_SLOTS: { id: TimeSlotId; label: string; shortLabel: string }[] = [
  { id: 'MORNING', label: '7:00 AM - 10:00 AM', shortLabel: '7 AM - 10 AM' },
  { id: 'AFTERNOON', label: '12:00 PM - 3:00 PM', shortLabel: '12 PM - 3 PM' },
  { id: 'EVENING', label: '5:00 PM - 8:00 PM', shortLabel: '5 PM - 8 PM' },
];

export const DELIVERY_TYPES: {
  id: DeliveryTypeId;
  label: string;
  caption: string;
  available: boolean;
}[] = [
  { id: 'STANDARD', label: 'Standard Delivery', caption: 'Delivered within 24 hours', available: true },
  // Express is switched off until capacity is available; the UI shows it as "Slot Full"
  { id: 'EXPRESS', label: 'Express Delivery', caption: 'Delivered within 4 hours', available: false },
];

export const SCHEDULE_TIMELINE = [
  { title: 'Pickup Scheduled', caption: "We're on our way" },
  { title: 'Picked Up', caption: 'Your clothes are safe with us!' },
  { title: 'Ready for Dispatch', caption: 'Crisp folds underway!' },
  { title: 'Out for Delivery', caption: 'Fresh, crisp and cared for!' },
  { title: 'Delivered', caption: 'All done! Folded with care.' },
];

export const CANCEL_REASONS = [
  'Clothes were not ready for pickup',
  'Not available at home during pickup',
  'Booked by mistake',
  'Found a better service',
  'Other',
];

/** Number of selectable pickup dates, starting tomorrow */
export const SCHEDULE_DAYS_AHEAD = 14;

const pad = (n: number) => String(n).padStart(2, '0');

/** YYYY-MM-DD in local time (toISOString would shift the date for IST users) */
export const toLocalDateString = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (dateStr: string, days: number): string => {
  const date = parseLocalDate(dateStr);
  date.setDate(date.getDate() + days);
  return toLocalDateString(date);
};

/** Pickup dates run from tomorrow onwards; today is never bookable */
export const getScheduleDates = (from: Date = new Date(), count = SCHEDULE_DAYS_AHEAD) =>
  Array.from({ length: count }, (_, i) => {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i + 1);
    return {
      dateString: toLocalDateString(date),
      weekday: i === 0 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short' }),
      day: date.getDate(),
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
    };
  });

export const formatScheduleDate = (dateStr: string): string =>
  parseLocalDate(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

export const getItemRangeLabel = (id: ItemRangeId) => ITEM_RANGES.find(r => r.id === id)?.label ?? '-';

export const getTimeSlot = (id: TimeSlotId) => SCHEDULE_TIME_SLOTS.find(s => s.id === id) ?? SCHEDULE_TIME_SLOTS[0];

export const getDeliveryType = (id: DeliveryTypeId) => DELIVERY_TYPES.find(d => d.id === id) ?? DELIVERY_TYPES[0];

/** Standard delivery lands 24 hours after pickup, in the same time window */
export const getEstimatedDelivery = (schedule: Pick<PickupSchedule, 'pickupDate' | 'timeSlot'>): string =>
  `${formatScheduleDate(addDays(schedule.pickupDate, 1))} • ${getTimeSlot(schedule.timeSlot).shortLabel}`;

export const isUpcoming = (schedule: PickupSchedule, today: string = toLocalDateString(new Date())) =>
  schedule.status === 'SCHEDULED' && schedule.pickupDate >= today;
