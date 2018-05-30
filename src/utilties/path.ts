import * as t from 'io-ts';
import { isArrayType, isCompoundType, isDictType } from './tag';

/** @internal */
export function getContextPath(context: t.Context): string {
  return ["$", ...context.slice(1).map((i) => i.key)].join(".")
}

/** @internal */
export function getRealContextPath(context: t.Context): string {
  let last: t.Decoder<any, any> = context[0].type;
  return ["$", ...context.slice(1).filter((i) => {
    const realLast = last;
    last = i.type;
    return isCompoundType(realLast);
  }).filter((i) => i)].join(".")
}

/** @internal */
export function getJavaScriptContextPath(context: t.Context): string {
  let last: t.Decoder<any, any> = context[0].type;
  return ["$", ...context.slice(0).map((i) => {
    const realLast = last;
    last = i.type;
    if (isCompoundType(realLast)) {
      return "";
    } else if (isArrayType(realLast)) {
      return `[${i.key}]`
    } else if (isDictType(realLast)) {
      return `[${JSON.stringify(i.key)}]`
    } else {
      return `.${i.key}`;
    }
  })].join("")
}
