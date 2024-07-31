import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCustomStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
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
        defaultMessage(args: ValidationArguments) {
          return 'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.';
        },
      },
    });
  };
}
