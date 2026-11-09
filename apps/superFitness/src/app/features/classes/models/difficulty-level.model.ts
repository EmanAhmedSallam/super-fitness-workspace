export interface DifficultyLevelModel {
  id: string;
  name: string;
}

export interface DifficultyLevelsResponse {
   message: string;
  totalLevels: number;
  difficulty_levels: DifficultyLevelModel[];
}
