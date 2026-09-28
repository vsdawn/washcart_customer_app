import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '../../types/address';
import { MOCK_ADDRESSES } from '../../mocks/addresses';

interface LocationState {
  selectedAddress: Address | null;
  savedAddresses: Address[];
  currentGpsAddressText: string | null;
  isLoading: boolean;
}

const initialState: LocationState = {
  selectedAddress: MOCK_ADDRESSES[0],
  savedAddresses: MOCK_ADDRESSES,
  currentGpsAddressText: 'Whitefield, Bengaluru',
  isLoading: false,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedAddress: (state, action: PayloadAction<Address>) => {
      state.selectedAddress = action.payload;
    },
    setSavedAddresses: (state, action: PayloadAction<Address[]>) => {
      state.savedAddresses = action.payload;
      if (!state.selectedAddress && action.payload.length > 0) {
        state.selectedAddress = action.payload.find(a => a.isDefault) || action.payload[0];
      }
    },
    /** Adds a new address or replaces an edited one */
    addAddressSuccess: (state, action: PayloadAction<Address>) => {
      const index = state.savedAddresses.findIndex(a => a.id === action.payload.id);
      if (index >= 0) {
        state.savedAddresses[index] = action.payload;
      } else {
        state.savedAddresses.push(action.payload);
      }
      if (
        action.payload.isDefault ||
        state.savedAddresses.length === 1 ||
        state.selectedAddress?.id === action.payload.id
      ) {
        state.selectedAddress = action.payload;
      }
    },
    setCurrentGpsText: (state, action: PayloadAction<string>) => {
      state.currentGpsAddressText = action.payload;
    },
  },
});

export const { setSelectedAddress, setSavedAddresses, addAddressSuccess, setCurrentGpsText } = locationSlice.actions;

export default locationSlice.reducer;
