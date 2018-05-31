import * as t from 'io-ts';
import { loiTagTypeDecorator } from '../utilties/tag';

export class LoiDecoratorNullAsUndefined<RT extends t.Any, A = RT['_A'], O = RT['_O'], I = RT['_I']> extends t.Type<A, O, I> {
  static readonly _tag: 'LoiDecoratorNullAsUndefined' = 'LoiDecoratorNullAsUndefined'
  readonly _tag: 'LoiDecoratorNullAsUndefined' = 'LoiDecoratorNullAsUndefined'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is A => type.is(v),
      (v: any, c: any) =>
        (v === null || v === undefined) ? t.success(undefined) : type.validate(v, c),
      (v: any) => type.encode(v)
    )
  }
}