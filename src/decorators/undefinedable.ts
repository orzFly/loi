import * as t from 'io-ts';
import { loiTagTypeDecorator } from '../utilties/tag';

export class LoiDecoratorUndefinedable<RT extends t.Any, CVS extends (string | number | boolean | null | undefined)[] = []> extends t.Type<RT['_A'] | undefined, RT['_O'] | undefined, RT['_I']> {
  static readonly _tag: 'LoiDecoratorUndefinedable' = 'LoiDecoratorUndefinedable'
  readonly _tag: 'LoiDecoratorUndefinedable' = 'LoiDecoratorUndefinedable'
  readonly [loiTagTypeDecorator] = true;
  constructor(
    readonly type: RT,
    readonly castValues: CVS = [] as any,
    name: string = type.name,
  ) {
    super(
      name,
      (v: any): v is RT['_A'] | undefined => (v === undefined || castValues.indexOf(v) >= 0) ? true : type.is(v),
      (v: any, c: any) =>
        (v === undefined || castValues.indexOf(v) >= 0) ? t.success(undefined) : type.validate(v, c),
      (v: any) => (v === undefined || castValues.indexOf(v) >= 0) ? v : type.encode(v)
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
      (v: any): v is Exclude<RT['_A'], undefined> => {
        if (v === undefined) return false;
        if (!type.is(v)) return false;
        const result = type.decode(v);
        if (result.isLeft()) return false;
        if (result.value === undefined) return false;
        return true;
      },
      (v: any, c: any) => {
        if (v === undefined) return t.failure(undefined, c);
        const result = type.validate(v, c);

        if (result.isLeft()) return result
        if (result.value === undefined) return t.failure(undefined, c);
        return result;
      },
      (v: any) => type.encode(v)
    )
  }
}