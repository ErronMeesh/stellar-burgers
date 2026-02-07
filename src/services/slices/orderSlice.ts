import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response.order;
  }
);

interface OrderState {
  order: TOrder | null;
  request: boolean;
  error: string | null | undefined;
}

const initialState: OrderState = {
  order: null,
  request: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.request = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.request = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
