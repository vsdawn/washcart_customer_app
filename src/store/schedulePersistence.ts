import storage from '../utils/storage';
import { PickupSchedule } from '../types/schedule';
import { hydrateSchedules } from './slices/scheduleSlice';
import type { AppStore } from './store';

const SCHEDULES_KEY = '@washkart_schedules';

/** Restores saved pickups, then writes them back to device storage whenever they change */
export const startSchedulePersistence = async (store: AppStore) => {
  const saved = await storage.getItem<PickupSchedule[]>(SCHEDULES_KEY);
  store.dispatch(hydrateSchedules(saved ?? []));

  let lastSaved = store.getState().schedule.schedules;
  store.subscribe(() => {
    const { schedules } = store.getState().schedule;
    if (schedules !== lastSaved) {
      lastSaved = schedules;
      storage.setItem(SCHEDULES_KEY, schedules);
    }
  });
};
