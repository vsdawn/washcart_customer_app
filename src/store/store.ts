import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import locationReducer from './slices/locationSlice';
import orderReducer from './slices/orderSlice';
import notificationReducer from './slices/notificationSlice';
import appReducer from './slices/appSlice';
import scheduleReducer from './slices/scheduleSlice';
import { startSchedulePersistence } from './schedulePersistence';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    location: locationReducer,
    order: orderReducer,
    notification: notificationReducer,
    app: appReducer,
    schedule: scheduleReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

startSchedulePersistence(store);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
