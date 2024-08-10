import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  name: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  description: string;

  @IsEmail()
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  mailing: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  phone: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  address: string;
}
