import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '@super-fitness/data-access-user';
import {
  MuscleGroupResponseModel,
  MuscleModel,
  MusclesResponseModel,
} from '../models/muscles.model';

@Injectable({ providedIn: 'root' })
export class MusclesService extends ApiClient<MuscleModel> {
  protected readonly endpoint = 'muscles';

  getAllMuscleGroups(): Observable<MuscleGroupResponseModel> {
    return this.get<MuscleGroupResponseModel>();
  }

  getGroupById(id: string): Observable<MusclesResponseModel> {
    return this.http.get<MusclesResponseModel>(
      `${this.baseUrl}/musclesGroup/${id}`,
    );
  }
}
