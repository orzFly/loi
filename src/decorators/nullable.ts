import * as t from 'io-ts';
import { loiTagTypeDecorator } from '../utilties/tag';

export class LoiDecoratorNullable<RT extends t.Any> extends t.Type<RT['_A'] | null, RT['_O'] | null, RT['_I']> {
  static readonly _tag: 'LoiDecoratorNullable' = 'LoiDecoratorNullable'
  readonly _tag: 'LoiDecoratorNullable' = 'LoiDecoratorNullable'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is RT['_A'] | null => (v === null) ? true : type.is(v),
      (v: any, c: any) =>
        (v === null) ? t.success(null) : type.validate(v, c),
      (v: any) => type.encode(v)
    )
  }
}

export class LoiDecoratorNotNullable<RT extends t.Any> extends t.Type<Exclude<RT['_A'], null>, Exclude<RT['_O'], null>, RT['_I']> {
  static readonly _tag: 'LoiDecoratorNotNullable' = 'LoiDecoratorNotNullable'
  readonly _tag: 'LoiDecoratorNotNullable' = 'LoiDecoratorNotNullable'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is Exclude<RT['_A'], null> => (v === null) ? false : type.is(v),
      (v: any, c: any) =>
        (v === null) ? t.failure(null, c) : type.validate(v, c),
      (v: any) => type.encode(v)
    )
  }
}