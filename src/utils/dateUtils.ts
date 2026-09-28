import { PickupSlot, DeliverySlot } from '../types/order';

export const TIME_SLOTS = [
  '07:00 AM - 09:00 AM',
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '05:00 PM - 07:00 PM',
  '07:00 PM - 09:00 PM',
];

export const generatePickupDates = (): { dateString: string; label: string }[] => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    let label = 'Today';
    if (i === 1) label = 'Tomorrow';
    if (i === 2) {
      label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    }

    dates.push({
      dateString: d.toISOString().split('T')[0],
      label,
    });
  }
  return dates;
};

export const generateDeliveryDates = (pickupDateStr: string): { dateString: string; label: string }[] => {
  const dates = [];
  const pickupDate = pickupDateStr ? new Date(pickupDateStr) : new Date();

  // Minimum processing time is 24 hours (1 day minimum)
  for (let i = 1; i <= 3; i++) {
    const d = new Date(pickupDate);
    d.setDate(pickupDate.getDate() + i);

    const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    dates.push({
      dateString: d.toISOString().split('T')[0],
      label,
    });
  }
  return dates;
};

export const getPickupSlotsForDate = (dateStr: string): PickupSlot[] => {
  const todayStr = new Date().toISOString().split('T')[0];
  const currentHour = new Date().getHours();

  return TIME_SLOTS.map(timeRange => {
    let isAvailable = true;

    // If pickup date is today, disable past time slots
    if (dateStr === todayStr) {
      if (timeRange.startsWith('07:00 AM') && currentHour >= 8) isAvailable = false;
      if (timeRange.startsWith('09:00 AM') && currentHour >= 10) isAvailable = false;
      if (timeRange.startsWith('11:00 AM') && currentHour >= 12) isAvailable = false;
      if (timeRange.startsWith('05:00 PM') && currentHour >= 18) isAvailable = false;
      if (timeRange.startsWith('07:00 PM') && currentHour >= 20) isAvailable = false;
    }

    return {
      date: dateStr,
      timeRange,
      isAvailable,
    };
  });
};

export const getDeliverySlotsForDate = (dateStr: string): DeliverySlot[] => {
  return TIME_SLOTS.map(timeRange => ({
    date: dateStr,
    timeRange,
    isAvailable: true,
  }));
};
