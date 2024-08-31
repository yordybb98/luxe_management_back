import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsString, MinLength } from 'class-validator';
import { IsEnumArray } from 'src/common/decorators/validators/enums/IsEnumArray';

export class CreateRoleDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  name: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnumArray(Permission)
  permissions: Permission[];
}
