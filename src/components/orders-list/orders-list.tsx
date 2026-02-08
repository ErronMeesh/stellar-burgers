import { FC, memo } from 'react';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const orderByDate = [...orders]
    // фильтр заказов с удаленными (null) ингредиентами, чтобы избежать ошибок рендера
    .filter(
      (order) => order.ingredients && order.ingredients.every((i) => i !== null)
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return <OrdersListUI orderByDate={orderByDate} />;
});
