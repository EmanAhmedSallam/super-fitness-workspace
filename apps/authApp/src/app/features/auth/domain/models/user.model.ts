export type Gender = 'male' | 'female';

export type ActivityLevel =
  | 'level1'
  | 'level2'
  | 'level3'
  | 'level4'
  | 'level5';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  goal: string;
  activityLevel: ActivityLevel;
  photo?: string;
  role?: string;
  createdAt?: string;
}
