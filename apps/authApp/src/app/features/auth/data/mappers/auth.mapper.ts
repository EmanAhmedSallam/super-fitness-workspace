import { User } from '../../domain/models/user.model';
import { UserDto } from '../dto/user.dto';

export function mapUserDtoToDomain(dto: UserDto): User {
  return {
    _id: dto._id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    gender: dto.gender,
    age: dto.age,
    height: dto.height,
    weight: dto.weight,
    goal: dto.goal,
    activityLevel: dto.activityLevel,
    photo: dto.photo,
    role: dto.role,
    createdAt: dto.createdAt,
  };
}
