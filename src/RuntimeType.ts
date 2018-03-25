import * as t from 'io-ts';
import { isString, keys } from 'lodash';
import { convert, nullAsUndefined } from './utilties/convert';

// #region enum

// https://github.com/gcanti/io-ts/issues/67#issuecomment-343769352

function enumWords(e: any): string[] {
  return keys(e).filter((i) => isString(e[i])).map((i) => e[i])
}

export function makeStringEnum<E>(name: string, e: any) {
  const values = enumWords(e)
  return t.union(values.map((i) => t.literal(i)), name) as any as t.Type<E, E, string>
}

// #endregion

export function ensureSameType<X, Y extends X>(): [X, Y] { return undefined; };

export const trueBoolean = t.refinement(t.boolean, (i) => i === true, 'true');
export const falseBoolean = t.refinement(t.boolean, (i) => i === false, 'false');

export const violetTrueBoolean = convert(nullAsUndefined(trueBoolean), (i) => i = undefined, (i) => i !== true);
export const violetFalseBoolean = convert(nullAsUndefined(falseBoolean), (i) => i = undefined, (i) => i !== false);
