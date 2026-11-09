import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MealDetailsResponseModel } from '../models/meal-details.model';

@Injectable({ providedIn: 'root' })
export class MealDetailsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://www.themealdb.com/api/json/v1/1';

  getMealById(id: string): Observable<MealDetailsResponseModel> {
    return this.http.get<MealDetailsResponseModel>(`${this.baseUrl}/lookup.php`, {
      params: { i: id },
    });
  }
}
