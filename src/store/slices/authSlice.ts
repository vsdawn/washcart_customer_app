import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types/user';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isOnboarded: true,
  isLoading: false,
  error: null,
  otpSentMobile: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOtpSent: (state, action: PayloadAction<string>) => {
      state.otpSentMobile = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSentMobile = null;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setOtpSent, loginSuccess, updateUser, logout, setAuthLoading, setAuthError } = authSlice.actions;

export default authSlice.reducer;
