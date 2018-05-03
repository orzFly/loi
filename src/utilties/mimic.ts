import * as t from 'io-ts';

function getObjectAllPropertyKeys(o: any): string[] {
  const prototype = Object.getPrototypeOf(o)
  const ownPropertyNames = Object.getOwnPropertyNames(o)
  return prototype ? ownPropertyNames.concat(getObjectAllPropertyKeys(prototype)) : ownPropertyNames;
}

/** @internal */
export function mimic<T, J extends t.Any>(fn: T, baseType: J) {
  const keys = getObjectAllPropertyKeys(fn);
  for (const i in baseType) {
    if (keys.indexOf(i) < 0) {
      (<any>fn)[i] = baseType[i]
    }
  }
  return fn as typeof fn & typeof baseType;
}