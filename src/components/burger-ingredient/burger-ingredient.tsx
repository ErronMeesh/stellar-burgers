import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    // убираем count из пропсов, будем считать его сами
    const location = useLocation();
    const dispatch = useDispatch();

    // состав конструктора из стора
    const { bun, ingredients } = useSelector(
      (state) => state.burgerConstructor
    );

    // логика подсчета по ТЗ
    const count =
      ingredient.type === 'bun'
        ? bun?._id === ingredient._id
          ? 2
          : 0 // булки всегда 2
        : ingredients.filter((item) => item._id === ingredient._id).length;

    const handleAdd = () => {
      // + в конструктор
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
