import { ValidationError } from 'class-validator';

export function getErrorMessageFromValidationErrors(errors: ValidationError[]) {
  const constraints: { [key: string]: string[] } = {};
  errors.forEach((error) => {
    const propertyName = error.property;
    const errorConstraints = Object.values(error.constraints!);
    constraints[propertyName] = errorConstraints;
  });
  const errorMessage = JSON.stringify(constraints);
  return errorMessage;
}
