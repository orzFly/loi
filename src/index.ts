import * as t from 'io-ts';
import * as rt from './RuntimeType';
import * as Number from './types/Number';

// tslint:disable:variable-name
export namespace Loi {
  export type Type<RT extends t.Any> = RT['_A'];

  export const number = Number.number
  export const union = t.union
  export const validate = rt.validate
}

export default Loi;
