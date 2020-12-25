import * as t from './iots';
import { Either } from './iots/Either';
import { PathReporter } from './iots/PathReporter';

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

export function tidyText(str: string) {
  return str.replace(/^\s+?#|\s+?$/g, "").replace(/\n\s+?#/g, "\n")
}
