import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '@super-fitness/data-access-user';
import {ExerciseModel,ExercisesResponse,} from '../models/exercise.model';

@Injectable({ providedIn: 'root' })
export class ExercisesService extends ApiClient<ExerciseModel> {
  protected readonly endpoint = 'exercises/by-muscle-difficulty';

  //  Get Exercises By Prime Mover Muscle and Difficulty Level

  getExercisesByMuscleAndDifficulty(
    primeMoverMuscleId: string,
    difficultyLevelId: string,
    page?: number,
    limit?: number,
  ): Observable<ExercisesResponse> {
   
    return this.get<ExercisesResponse>({ 
      primeMoverMuscleId,
      difficultyLevelId,
      page,
      limit,
     });
  }


   getRandomExercises(
    targetMuscleGroupId: string,
    difficultyLevelId: string,
    limit = 5,
  ): Observable<ExercisesResponse> {
    return this.get<ExercisesResponse>(
      {
        targetMuscleGroupId,
        difficultyLevelId,
        limit,
      },
      
    );
  }

}
