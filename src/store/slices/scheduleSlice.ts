import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PickupSchedule } from '../../types/schedule';
import { isUpcoming, SCHEDULE_TIME_SLOTS, toLocalDateString } from '../../constants/scheduleConfig';

const slotOrder = (id: PickupSchedule['timeSlot']) => SCHEDULE_TIME_SLOTS.findIndex(s => s.id === id);

interface ScheduleState {
  schedules: PickupSchedule[];
  hydrated: boolean;
}

const initialState: ScheduleState = {
  schedules: [],
  hydrated: false,
};

export const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    hydrateSchedules: (state, action: PayloadAction<PickupSchedule[]>) => {
      state.schedules = action.payload;
      state.hydrated = true;
    },
    addSchedule: (state, action: PayloadAction<PickupSchedule>) => {
      state.schedules.unshift(action.payload);
    },
    updateSchedule: (state, action: PayloadAction<Partial<PickupSchedule> & { id: string }>) => {
      const schedule = state.schedules.find(s => s.id === action.payload.id);
      if (schedule) {
        Object.assign(schedule, action.payload, { updatedAt: new Date().toISOString() });
      }
    },
    cancelSchedule: (state, action: PayloadAction<{ id: string; reason: string }>) => {
      const schedule = state.schedules.find(s => s.id === action.payload.id);
      if (schedule) {
        schedule.status = 'CANCELLED';
        schedule.cancelReason = action.payload.reason;
        schedule.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const { hydrateSchedules, addSchedule, updateSchedule, cancelSchedule } = scheduleSlice.actions;

type WithSchedule = { schedule: ScheduleState };

export const selectScheduleById = (state: WithSchedule, id: string) =>
  state.schedule.schedules.find(s => s.id === id);

/** Active pickups from today onwards, soonest first */
export const selectUpcomingSchedules = createSelector(
  [(state: WithSchedule) => state.schedule.schedules],
  schedules => {
    const today = toLocalDateString(new Date());
    return schedules
      .filter(s => isUpcoming(s, today))
      .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate) || slotOrder(a.timeSlot) - slotOrder(b.timeSlot));
  }
);

export default scheduleSlice.reducer;
