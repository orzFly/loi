import * as t from '../iots';

function getObjectAllPropertyKeys<T>(o: T): string[] {
  const prototype = Object.getPrototypeOf(o)
  const ownPropertyNames = Object.getOwnPropertyNames(o)
  return prototype ? ownPropertyNames.concat(getObjectAllPropertyKeys(prototype)) : ownPropertyNames;
}

/** @internal */
export function mimic<T, J extends t.Any>(fn: T, baseType: J) {
  const keys = getObjectAllPropertyKeys(fn);
  for (const i of getObjectAllPropertyKeys(baseType)) {
    if (keys.indexOf(i) < 0) {
      (<any>fn)[i] = (baseType as any)[i as any]
    }
  }
  return fn as typeof fn & typeof baseType;
}
