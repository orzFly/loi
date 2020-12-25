import * as t from '../iots';
import { getRealContextPath } from '../utilties/path';
import { stringify } from '../utilties/stringify';
import { createMessage } from './message';

// tslint:disable:interface-name

export interface LoiValidationError extends Error {
  details: LoiValidationErrorItem[];
  httpCode: 400;
  code: "validation_error";
}

export interface LoiValidationErrorItem {
  type: string;
  path: string,
  kind: string,
  message?: string;
}

export interface LoiValidationResult<T> {
  error?: LoiValidationError;
  value?: T;
}

/** @internal */
export function createErrorDetailItem(v: any, context: t.Context): LoiValidationErrorItem {
  return {
    type: "invalid",
    path: getRealContextPath(context),
    kind: context[context.length - 1].type.name,
    message: `Invalid value \`${stringify(v)}' supplied to ${getRealContextPath(context)}: ${context[context.length - 1].type.name}.`
  }
}

export function createError(results: t.ValidationError[]): LoiValidationError {
  const error = new Error() as LoiValidationError
  error.httpCode = 400;
  error.code = "validation_error";
  error.message = `Validation Error\n\n${createMessage(results)}`;
  error.details = results.map((e) => createErrorDetailItem(e.value, e.context));
  return error;
}
