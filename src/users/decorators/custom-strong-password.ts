import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCustomStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCustomStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const hasMinLength = value.length >= 8;
          const hasLowercase = /[a-z]/.test(value);
          const hasUppercase = /[A-Z]/.test(value);
          const hasNumbers = /\d/.test(value);
          const hasSymbols = /[\W_]/.test(value);
          return (
            hasMinLength &&
            hasLowercase &&
            hasUppercase &&
            hasNumbers &&
            hasSymbols
          );
        },
        defaultMessage() {
          return 'A senha não é forte o suficiente.';
        },
      },
    });
  };
}
