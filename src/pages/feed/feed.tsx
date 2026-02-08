import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { wsConnect, wsDisconnect } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(wsConnect('wss://norma.education-services.ru/orders/all'));
    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  if (status === 'loading' && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(wsConnect('wss://norma.education-services.ru/orders/all'));
      }}
    />
  );
};
