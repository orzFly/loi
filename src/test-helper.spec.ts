import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

export function shouldValidate<Right>(e: Either<t.ValidationError[], Right>) {
  return e.fold((err) => {
    const error = new Error(PathReporter.report(e).join("\n"));
    (<any>error).details = err;
    throw error;
  }, (right) => right);
}

export function shouldNotValidate<Right>(e: Either<t.ValidationError[], Right>) {
  return e.fold((err) => err, () => { throw new Error('Should Not Validate') });
}
