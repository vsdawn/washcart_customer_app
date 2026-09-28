export type ItemRangeId = 'UPTO_10' | 'FROM_11_TO_20' | 'FROM_21_TO_50' | 'ABOVE_50';

export type TimeSlotId = 'MORNING' | 'AFTERNOON' | 'EVENING';

export type DeliveryTypeId = 'STANDARD' | 'EXPRESS';

export type ScheduleStatus = 'SCHEDULED' | 'CANCELLED';

export interface ScheduleItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface PickupSchedule {
  id: string;
  serviceName: string;
  /** One-line pickup address shown on the schedule */
  address: string;
  /** Snapshot of the cart when the pickup was booked from the cart */
  items: ScheduleItem[];
  itemRange: ItemRangeId;
  /** Local calendar date, YYYY-MM-DD */
  pickupDate: string;
  timeSlot: TimeSlotId;
  deliveryType: DeliveryTypeId;
  instructions: string;
  status: ScheduleStatus;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}
