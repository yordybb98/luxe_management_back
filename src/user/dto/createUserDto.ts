import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(1)
  name: string;

  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(1)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(6)
  password: string;

  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(1)
  role: string;
}
