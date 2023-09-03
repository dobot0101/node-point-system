import { IsOptional, IsUUID, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export class PointRequest {
  @IsUUID()
  userId!: string;

  @IsUUID()
  reviewId!: string;

  @IsUUID()
  @IsOptional()
  placeId?: string | null;

  @IsActionValid()
  action!: 'ADD' | 'MOD' | 'DELETE';
  // action!: string;
}

function IsActionValid(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isActionValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return ['ADD', 'MOD', 'DELETE'].includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be one of: ADD, MOD, DELETE`;
        },
      },
    });
  };
}
