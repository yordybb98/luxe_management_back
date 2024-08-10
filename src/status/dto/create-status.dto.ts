import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(1)
  name: string;
}
