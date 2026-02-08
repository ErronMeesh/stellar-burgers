import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TFeedResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: 'idle' | 'loading' | 'online' | 'offline';
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnect: (state, action: PayloadAction<string>) => {
      state.status = 'loading';
    },
    wsDisconnect: (state) => {
      state.status = 'offline';
    },
    wsConnecting: (state) => {
      state.status = 'loading';
    },
    wsOpen: (state) => {
      state.status = 'online';
      state.error = null;
    },
    wsClose: (state) => {
      state.status = 'offline';
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'offline';
    },
    wsMessage: (state, action: PayloadAction<TFeedResponse>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.status = 'online';
    }
  }
});

export const {
  wsConnect,
  wsDisconnect,
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage
} = feedSlice.actions;

export default feedSlice.reducer;
