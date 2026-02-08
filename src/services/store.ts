import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import feedReducer, {
  wsConnect,
  wsDisconnect,
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage
} from './slices/feedSlice';
import profileOrdersReducer, {
  profileWsConnect,
  profileWsDisconnect,
  profileWsConnecting,
  profileWsOpen,
  profileWsClose,
  profileWsError,
  profileWsMessage
} from './slices/profileOrdersSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

const feedMiddleware = socketMiddleware({
  wsConnect: wsConnect,
  wsDisconnect: wsDisconnect,
  wsConnecting: wsConnecting,
  onOpen: wsOpen,
  onClose: wsClose,
  onError: wsError,
  onMessage: wsMessage
});

const profileMiddleware = socketMiddleware({
  wsConnect: profileWsConnect,
  wsDisconnect: profileWsDisconnect,
  wsConnecting: profileWsConnecting,
  onOpen: profileWsOpen,
  onClose: profileWsClose,
  onError: profileWsError,
  onMessage: profileWsMessage
});

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  order: orderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware).concat(profileMiddleware)
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
