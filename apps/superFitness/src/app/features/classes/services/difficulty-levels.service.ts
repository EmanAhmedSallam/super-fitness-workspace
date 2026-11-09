import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '@super-fitness/data-access-user';
import {
  DifficultyLevelModel,
  DifficultyLevelsResponse,
} from '../models/difficulty-level.model';

@Injectable({ providedIn: 'root' })
export class DifficultyLevelsService extends ApiClient<DifficultyLevelModel> {
  protected readonly endpoint = 'levels/difficulty-levels/by-prime-mover';

  getAllDifficultyLevels(primeMoverMuscleId: string): Observable<DifficultyLevelsResponse> {
    return this.get<DifficultyLevelsResponse>({ primeMoverMuscleId });
  }
}
