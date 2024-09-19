import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsString, Min, MinLength } from 'class-validator';

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

  @IsEmail()
  email: string;

  @IsNumber()
  @MinLength(1)
  roleId: number;

  @IsNumber()
  @MinLength(1)
  departmentId: number;
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
  username: string;
  email: string;
  departmentId: number;
  roleId: number;
  orders: [];
  projects: [];
  permissions: [];
}

export class ValidateTokenDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(1)
  token: string;
}
