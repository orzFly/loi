import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

export function shouldValidate<Right>(e: Either<t.ValidationError[], Right>) {
  return e.fold((err) => { throw err }, (right) => right);
}

export function shouldNotValidate<Right>(e: Either<t.ValidationError[], Right>) {
  return e.fold((err) => err, (right) => { throw new Error('Should Not Validate') });
}
