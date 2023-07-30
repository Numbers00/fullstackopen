import { ValidationError } from './types';


export const isValidationError = (data: unknown): data is ValidationError => {
  return (
    data !== null &&
    typeof data === 'object' &&
    'message' in data
  );
};
