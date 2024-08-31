// validators/IsEnumArray.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsEnumArray(
  enumType: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEnumArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumType],
      validator: {
        validate(value: any[], args: ValidationArguments) {
          const [enumType] = args.constraints;
          return (
            Array.isArray(value) &&
            value.every((val) => Object.values(enumType).includes(val))
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [enumType] = args.constraints;
          return `${args.property} must be an array of valid enum values. Valid values are: ${Object.values(enumType).join(', ')}`;
        },
      },
    });
  };
}
