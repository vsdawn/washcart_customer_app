import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isNetworkConnected: boolean;
  activeSearchQuery: string;
}

const initialState: AppState = {
  isNetworkConnected: true,
  activeSearchQuery: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isNetworkConnected = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.activeSearchQuery = action.payload;
    },
  },
});

export const { setNetworkStatus, setSearchQuery } = appSlice.actions;

export default appSlice.reducer;
