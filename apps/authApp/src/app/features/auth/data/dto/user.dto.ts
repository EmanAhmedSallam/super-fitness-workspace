export interface UserDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  goal: string;
  activityLevel: 'level1' | 'level2' | 'level3' | 'level4' | 'level5';
  photo?: string;
  role?: string;
  createdAt?: string;
}
