import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const checkUserAuth = createAsyncThunk<TUser, void>(
  'user/checkAuth',
  async () => {
    const res = await getUserApi();
    return res.user;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logout = createAsyncThunk<void, void>('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

interface UserState {
  data: TUser | null;
  isAuthChecked: boolean;
  error: string | null | undefined;
}

const initialState: UserState = {
  data: null,
  isAuthChecked: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null; // очищаем ошибку при начале проверки
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
        state.error = null; // очищаем ошибку при успехе
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.error = null; // очищаем старые ошибки перед новой попыткой входа
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
        state.error = null; // очищаем ошибку после успешного входа
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
        state.error = null; // на всякий случай добавил очистку ошибки после регистрации, а то она оставалась после регистарции и до перезагрузки страницы
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = null;
        state.error = null;
      });
  }
});

export const { authCheck, setAuthError } = userSlice.actions;
export default userSlice.reducer;
