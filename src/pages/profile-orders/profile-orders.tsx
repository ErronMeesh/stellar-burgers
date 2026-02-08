import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  profileWsConnect,
  profileWsDisconnect
} from '../../services/slices/profileOrdersSlice';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.profileOrders);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const token = accessToken?.replace('Bearer ', '');

    if (token) {
      dispatch(
        profileWsConnect(
          `wss://norma.education-services.ru/orders?token=${token}`
        )
      );
    }

    return () => {
      dispatch(profileWsDisconnect());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
