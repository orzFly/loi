import * as t from 'io-ts';
import { createError, LoiValidationResult } from './error';

export function validate<S, A>(value: S, type: t.Decoder<S, A>): t.Validation<A> {
  return type.decode(value);
}

export function validateOrReturn<S, A>(value: S, type: t.Decoder<S, A>): LoiValidationResult<A> {
  const result = type.decode(value);

  if (result.isLeft()) {
    return { error: createError(result.value) };
  }

  return { value: result.value };
}

export function validateOrThrow<S, A>(value: S, type: t.Decoder<S, A>): A {
  const result = type.decode(value);

  if (result.isLeft()) {
    throw createError(result.value);
  }

  return result.value;
}
