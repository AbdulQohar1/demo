import { IsEmail, IsNotEmpty, IsString, IsEnum, MinLength, IsOptional  } from 'class-validator';
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()  // Optional to allow default value
  role?: UserRole;
}
