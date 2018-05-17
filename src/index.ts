import * as t from 'io-ts';

export type TypeOf<RT extends t.Any> = RT['_A'];

export { start, LoiFactoryBase } from './types/Base';
export { any, LoiFactoryAny } from './types/Any';
export { boolean, LoiFactoryBoolean, LoiFactoryBooleanInitial } from './types/Boolean';
export { number, LoiFactoryNumber } from './types/Number';
export { string, LoiFactoryString } from './types/String';
export { array, LoiFactoryArray } from './types/Array';
export { object, LoiFactoryObject, LoiFactoryObjectInitial } from './types/Object';
export { enumeration, LoiFactoryEnum } from './types/Enum';

export function validate<S, A>(value: S, type: t.Decoder<S, A>): t.Validation<A> {
  return type.decode(value);
}

export function ensureSameType<X, Y extends X>(): [X, Y] { return undefined as any; };
export function ensureTypeSame<X extends Y, Y>(): [X, Y] { return undefined as any; };
