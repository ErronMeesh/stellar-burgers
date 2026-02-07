import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom'; // для получения :id из URL

export const IngredientDetails: FC = () => {
  // забираем ID из URL
  const { id } = useParams();

  // достаем список всех ингредиентов из стора
  const { ingredients } = useSelector((state) => state.ingredients);

  // ищем нужный ингредиент
  const ingredientData = ingredients.find((item) => item._id === id);

  // если ингредиент не найден или данные еще грузятся, то показываем прелоадер
  if (!ingredientData) {
    return <Preloader />;
  }

  // если нашли, то показываем красивую карточку
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
