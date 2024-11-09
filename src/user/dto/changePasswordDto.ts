import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Transform(({ value }) => value.toString().trim())
  @MinLength(1)
  newPassword: string;
}
