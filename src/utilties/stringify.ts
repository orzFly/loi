import * as t from 'io-ts';

/** @internal */
export function stringify(v: any): string {
  return typeof v === 'function' ? t.getFunctionName(v) : JSON.stringify(v)
}
