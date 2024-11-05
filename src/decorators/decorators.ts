
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity'; // Adjust the path based on where your UserRole enum is located

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
