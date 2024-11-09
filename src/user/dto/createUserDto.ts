import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toString().trim())
  lastName: string;

  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(1)
  username: string;

  @IsOptional()
  @ValidateIf(
    (obj) => obj.email !== undefined && obj.email !== null && obj.email !== '',
  )
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(1)
  password: string;

  @IsNumber()
  roleId: number;

  @IsOptional()
  @ValidateIf(
    (obj) => obj.phone !== undefined && obj.phone !== null && obj.phone !== '',
  )
  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(10, { message: 'Phone number must be at least 10 characters' })
  phone: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toString().trim())
  address: string;
}
