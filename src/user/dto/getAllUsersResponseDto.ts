import { Role, User } from '@prisma/client';

export interface UserResponseDto extends Partial<User> {
  role: Role;
}
