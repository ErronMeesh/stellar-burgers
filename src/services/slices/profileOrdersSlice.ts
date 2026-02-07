import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TProfileOrdersResponse = {
  success: boolean;
  orders: TOrder[];
};

interface ProfileOrdersState {
  orders: TOrder[];
  status: 'idle' | 'loading' | 'online' | 'offline';
  error: string | null;
}

const initialState: ProfileOrdersState = {
  orders: [],
  status: 'idle',
  error: null
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    profileWsConnect: (state, action: PayloadAction<string>) => {
      state.status = 'loading';
    },
    profileWsDisconnect: (state) => {
      state.status = 'offline';
    },
    profileWsConnecting: (state) => {
      state.status = 'loading';
    },
    profileWsOpen: (state) => {
      state.status = 'online';
      state.error = null;
    },
    profileWsClose: (state) => {
      state.status = 'offline';
    },
    profileWsError: (state, action: PayloadAction<string>) => {
      state.status = 'offline';
      state.error = action.payload;
    },
    profileWsMessage: (
      state,
      action: PayloadAction<TProfileOrdersResponse>
    ) => {
      state.orders = action.payload.orders;
    }
  }
});

export const {
  profileWsConnect,
  profileWsDisconnect,
  profileWsConnecting,
  profileWsOpen,
  profileWsClose,
  profileWsError,
  profileWsMessage
} = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;
