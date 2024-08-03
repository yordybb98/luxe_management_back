import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  username: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(8)
  password: string;
}

export class SignInResponseDto {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  token: string;
}
