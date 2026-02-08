import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  removeIngredient,
  reorderIngredients
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      // если это последний элемент, то ниже двигать некуда
      if (index === totalItems - 1) return;

      dispatch(reorderIngredients({ from: index, to: index + 1 }));
    };

    const handleMoveUp = () => {
      // если это первый элемент, ио выше двигать некуда
      if (index === 0) return;

      dispatch(reorderIngredients({ from: index, to: index - 1 }));
    };

    // удаление
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
