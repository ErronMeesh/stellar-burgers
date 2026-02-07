import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload
} from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import { RootState } from '../store';

export type TwsActionTypes = {
  wsConnect: ActionCreatorWithPayload<string>;
  wsDisconnect: ActionCreatorWithoutPayload;
  wsSendMessage?: ActionCreatorWithPayload<any>;
  wsConnecting: ActionCreatorWithoutPayload;
  onOpen: ActionCreatorWithoutPayload;
  onClose: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<any>;
};

export const socketMiddleware =
  (wsActions: TwsActionTypes): Middleware<{}, RootState> =>
  (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;
      const { type } = action as { type: string; payload: any };
      const {
        wsConnect,
        wsDisconnect,
        wsSendMessage,
        onOpen,
        onClose,
        onError,
        onMessage
      } = wsActions;

      if (wsConnect.match(action)) {
        if (socket) {
          socket.close();
        }

        socket = new WebSocket(action.payload);
        dispatch(wsActions.wsConnecting());

        socket.onopen = () => {
          dispatch(onOpen());
        };

        socket.onerror = () => {
          dispatch(onError('Ошибка соединения'));
        };

        socket.onmessage = (event) => {
          const { data } = event;
          try {
            const parsedData = JSON.parse(data);
            dispatch(onMessage(parsedData));
          } catch (err) {
            dispatch(onError('Ошибка парсинга данных'));
          }
        };

        socket.onclose = () => {
          dispatch(onClose());
        };
      }

      if (wsDisconnect.match(action)) {
        if (socket) {
          socket.close();
          socket = null;
        }
      }

      if (wsSendMessage && wsSendMessage.match(action)) {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(action.payload));
        }
      }

      next(action);
    };
  };
