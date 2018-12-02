import * as t from 'io-ts';
import { loiTagTypeDecorator } from '../utilties/tag';

export class LoiDecoratorUndefinedable<RT extends t.Any> extends t.Type<RT['_A'] | undefined, RT['_O'] | undefined, RT['_I']> {
  static readonly _tag: 'LoiDecoratorUndefinedable' = 'LoiDecoratorUndefinedable'
  readonly _tag: 'LoiDecoratorUndefinedable' = 'LoiDecoratorUndefinedable'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is RT['_A'] | undefined => (v === undefined) ? true : type.is(v),
      (v: any, c: any) =>
        (v === undefined) ? t.success(undefined) : type.validate(v, c),
      (v: any) => type.encode(v)
    )
  }
}

export class LoiDecoratorNotUndefinedable<RT extends t.Any> extends t.Type<Exclude<RT['_A'], undefined>, Exclude<RT['_O'], undefined>, RT['_I']> {
  static readonly _tag: 'LoiDecoratorNotUndefinedable' = 'LoiDecoratorNotUndefinedable'
  readonly _tag: 'LoiDecoratorNotUndefinedable' = 'LoiDecoratorNotUndefinedable'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is Exclude<RT['_A'], undefined> => (v === undefined) ? false : type.is(v),
      (v: any, c: any) =>
        (v === undefined) ? t.failure(undefined, c) : type.validate(v, c),
      (v: any) => type.encode(v)
    )
  }
}