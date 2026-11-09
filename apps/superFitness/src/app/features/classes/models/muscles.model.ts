export interface MuscleModel {
  _id: string;
  name: string;
  image: string;
}

export interface MuscleGroupModel {
  _id: string;
  name: string;
}

export interface MusclesResponseModel {
  message: string;
  muscleGroup: MuscleGroupModel;
  muscles: MuscleModel[];
}

export interface MuscleGroupResponseModel {
  message: string;
  musclesGroup: MuscleGroupModel[];
}
