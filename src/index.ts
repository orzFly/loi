import * as t from 'io-ts';
import * as AnyType from './types/Any';
import * as BooleanType from './types/Boolean';
import * as NumberType from './types/Number';
import * as ObjectType from './types/Object';

// tslint:disable:variable-name

export namespace Loi {
  export type Type<RT extends t.Any> = RT['_A'];

  export const any = AnyType.any
  export const number = NumberType.number
  export const object = ObjectType.object
  export const boolean = BooleanType.boolean

  export function validate<S, A>(value: S, type: t.Decoder<S, A>): t.Validation<A> {
    return type.decode(value);
  }
}

export default Loi;
