import { MealModel } from '../../home/models/meal-categories.model';

export interface MealDetailsModel extends MealModel {
  strCategory: string;
  strArea: string | null;
  strInstructions: string | null;
  strTags: string | null;
  strYoutube: string | null;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

export interface MealDetailsResponseModel {
  meals: MealDetailsModel[] | null;
}

export interface MealIngredient {
  name: string;
  measure: string;
}
