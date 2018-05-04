import * as t from 'io-ts';

export type TypeOf<RT extends t.Any> = RT['_A'];

export { start, BaseFactory } from './types/Base';
export { any, AnyFactory } from './types/Any';
export { boolean, BooleanFactory } from './types/Boolean';
export { number, NumberFactory } from './types/Number';
export { array, ArrayFactory } from './types/Array';
export { object, ObjectFactory, InitialObjectFactory } from './types/Object';

export function validate<S, A>(value: S, type: t.Decoder<S, A>): t.Validation<A> {
  return type.decode(value);
}
