import * as t from 'io-ts';
import { loiTagTypeDecorator } from '../utilties/tag';

export class LoiDecoratorConvert<RT extends t.Any, X = any, A = any, O = A, I = t.mixed> extends t.Type<A, O, I> {
  static readonly _tag: 'LoiDecoratorConvert' = 'LoiDecoratorConvert'
  readonly _tag: 'LoiDecoratorConvert' = 'LoiDecoratorConvert'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    readonly convert: (val: X) => t.TypeOf<RT> = (val) => val,
    readonly guard: (val: X) => boolean = () => true,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is A => type.is(v),
      (v: any, c: any) =>
        type.validate(guard(v) ? convert(v) : v, c),
      (v: any) => type.encode(v)
    )
  }
}
