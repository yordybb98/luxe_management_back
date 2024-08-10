import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  name: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  description: string;
}
