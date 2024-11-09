import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignInDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  username: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(1)
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
}

export class SignInResponseDto {
  name: string;
  username: string;
  email: string;
  roleId: number;
  token: string;
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
