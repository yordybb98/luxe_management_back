import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  @ApiProperty({ example: 'john.doe', description: 'User email' })
  username: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(1)
  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  password: string;
}

export class SignUpDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  username: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(1)
  password: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  name: string;

  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(1)
  @IsOptional()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @MinLength(1)
  roleId: number;

  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(10)
  @IsOptional()
  phone: string;

  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(1)
  @IsOptional()
  address: string;

  @IsEnum(UserType, {
    message: 'userType must be a valid enum value: ADMIN, TECHNICIAN, DESIGNER',
  })
  userType: UserType;
}

export class SignInResponseDto {
  name: string;
  username: string;
  email: string;
  roleId: number;
  token: string;
  id: number;
}

export class SignUpResponseDto {
  name: string;
  lastName: string;
  username: string;
  email: string;
  roleId: number;
  phone: string;
  permissions: [];
  address: string;
}

export class ValidateTokenDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(1)
  token: string;
}
