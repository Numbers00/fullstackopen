// place in switch default branch to enforce exhaustive type checking
export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

export const isString = (str: unknown): str is string => {
  return typeof str === 'string' || str instanceof String;
};
