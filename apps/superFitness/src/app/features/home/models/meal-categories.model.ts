export interface MealCategoryModel {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealCategoriesResponseModel {
  categories: MealCategoryModel[];
}

export interface MealModel {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealsResponseModel {
  meals: MealModel[] | null;
}
