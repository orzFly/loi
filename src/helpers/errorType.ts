// tslint:disable:interface-name

export interface LoiValidationError extends Error {
  details: LoiValidationErrorItem[];
  httpCode: 400;
  code: "validation_error";
}

export interface LoiValidationErrorItem {
  type: string;
  path: string,
  message?: string;
}

export interface LoiValidationResult<T> {
  error?: LoiValidationError;
  value?: T;
}
