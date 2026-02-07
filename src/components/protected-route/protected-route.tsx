import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui';

type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: TProtectedRouteProps) => {
  // берем данные из стора которые мы настроили в userSlice
  const { data, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  // показываем прелоадер пока мы не проверили состояние авторизации
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // если роут только для гостей login/register, а пользователь уже залогинен
  if (onlyUnAuth && data) {
    // то перенаправляем на главную или на страницу, с которой он пришел
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  // если роут защищенный, а пользователя нет
  if (!onlyUnAuth && !data) {
    // отправляем на логин, сохранив в state текущий путь чтобы вернуться сюда после авторизации
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // если все проверки пройдены, то рендерим страницу
  return children;
};
