import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  // данные пользователя из Redux
  const { data } = useSelector((state) => state.user);

  return <AppHeaderUI userName={data?.name || ''} />;
};
