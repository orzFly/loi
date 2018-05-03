import * as t from 'io-ts';

/** @internal */
export function mimic<T, J extends t.Any>(fn: T, baseType: J) {
  (<any>fn).is = baseType.is;
  (<any>fn).validate = baseType.validate;
  (<any>fn).encode = baseType.encode;
  (<any>fn).asDecoder = baseType.asDecoder;
  (<any>fn).asEncoder = baseType.asEncoder;
  (<any>fn).decode = baseType.decode;
  (<any>fn)._tag = (<any>baseType)._tag;
  return fn as typeof fn & typeof baseType;
}