import * as t from 'io-ts';
import { loiTagTypeDecorator } from '../utilties/tag';

export class LoiDecoratorNullAsUndefined<RT extends t.Any> extends t.Type<RT['_A'] | undefined, RT['_O'] | undefined, RT['_I']> {
  static readonly _tag: 'LoiDecoratorNullAsUndefined' = 'LoiDecoratorNullAsUndefined'
  readonly _tag: 'LoiDecoratorNullAsUndefined' = 'LoiDecoratorNullAsUndefined'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is RT['_A'] | undefined => (v === null || v === undefined) ? true : type.is(v),
      (v: any, c: any) =>
        (v === null || v === undefined) ? t.success(undefined) : type.validate(v, c),
      (v: any) => type.encode(v)
    )
  }
}